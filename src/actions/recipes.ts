"use server";

import { getServerSession } from 'next-auth';

import { uploadImageToS3 } from './aws_s3';
import { options } from '../app/api/auth/[...nextauth]/options';
import { prisma } from '../config/db';
import { NewRecipeImageSchema, NewRecipeSchema } from '../types';

import type { NewRecipe, RecipeWithAuthor } from '../types';
import type { Recipe } from '@prisma/client';

export const getAll = async (): Promise<RecipeWithAuthor[]> => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { author: true },
    });

    return recipes;

    /*
    return await Promise.all(recipes.map(async (recipe) => {
      // Get pre-signed URL for recipe background image from AWS S3
      const preSignedUrl = recipe.image && await getSignedImageUrl(recipe.image);
      return {
        ...recipe,
        image: preSignedUrl
      };
    }));
    */
  } catch (error) {
    throw new Error(`Error getting recipes: ${(error as any).message}`);
  }
};

export const getById = async (id: number): Promise<RecipeWithAuthor | null> => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { author: true },
    });
    return recipe;
  } catch (error) {
    throw new Error(`Error getting recipe with id ${id}: ${(error as any).message}`);
  }
};

export const create = async (recipeData: NewRecipe, imageData: FormData) => {
  try {
    // TODO: clean up this mess
    const session = await getServerSession(options);
    if (!session) throw new Error('Not authenticated');

    const image = imageData.get('image') as File;    
    const validImage = NewRecipeImageSchema.safeParse(image);

    const recipe = NewRecipeSchema.parse({
      ...recipeData,
      image: validImage?.success ? validImage.data : undefined,
    });

    // Create unique name for s3 bucket
    const uniqueName = `${new Date().toISOString()}_${image.name}`;

    const createdRecipe = await prisma.recipe.create({
      data: {
        ...recipe,
        authorId: Number(session.user.id),
        ingredients: recipe.ingredients.map((i) => (i.ingredient)),
        image: validImage?.success ? uniqueName : undefined,
      }
    });

    if (validImage.success) {
      await uploadImageToS3(validImage.data, uniqueName);
    }

    return createdRecipe;
  } catch (error) {
    throw new Error(`Error creating recipe: ${(error as any).message}`);
  }
};

export const deleteById = async (id: number): Promise<Recipe | null> => {
  try {
    const deletedRecipe = await prisma.recipe.delete({ where: { id } });
    return deletedRecipe;
  } catch (error) {
    throw new Error(`Error deleting recipe with id ${id}: ${(error as any).message}`);
  }
};

export const createComment = async (data: any): Promise<any> => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error("Not authenticated");
    
    const createdComment = await prisma.recipeComment.create({ data: {
      ...data,
      authorId: Number(session.user.id),
    }});
    return createdComment;
  } catch (error) {
    throw new Error(`Error creating comment: ${(error as any).message}`);
  }
};