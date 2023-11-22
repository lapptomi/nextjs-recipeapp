"use server";

import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { uploadImageToS3 } from './aws_s3';
import { options } from '../app/api/auth/[...nextauth]/options';
import { prisma } from '../config/db';
import { RecipeSchema } from '../types';

import type { NewRecipe, RecipeWithAuthor } from '../types';
import type { Recipe } from '@prisma/client';

export const getAll = async (): Promise<RecipeWithAuthor[]> => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: { author: true },
    });
    return recipes;
  } catch (error) {
    throw new Error((error as any).message);
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
    throw new Error((error as any).message);
  }
};

export const create = async (recipe: NewRecipe, formData: FormData): Promise<Recipe> => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error('Not authenticated');

    const image = formData.get('image') as File;

    const validatedRecipe = RecipeSchema.parse({ ...recipe, image: image?.name });
    const createdRecipe = await prisma.recipe.create({
      data: {
        ...validatedRecipe,
        authorId: Number(session.user.id),
        ingredients: validatedRecipe.ingredients.map((i) => (i.ingredient))
      }
    });

    const imageSchema = z.object({
      name: z.string(),
      type: z.string(), // <- image/jpeg etc.
      size: z.number().max(2000000),
      lastModified: z.number(),
      lastModifiedDate: z.any(),
    });
    
    if (imageSchema.safeParse(image).success) {
      const uploadedImage = await uploadImageToS3(image);
      console.log('UPLOADED IMAGE = ', uploadedImage);
    }

    return createdRecipe;
  } catch (error) {
    throw new Error((error as any).message);
  }
};

export const deleteById = async (id: number): Promise<Recipe | null> => {
  try {
    const deletedRecipe = await prisma.recipe.delete({ where: { id } });
    return deletedRecipe;
  } catch (error) {
    throw new Error((error as any).message);
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
    throw new Error((error as any).message);
  }
};