"use server";

import { getServerSession } from 'next-auth';

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

export const create = async (recipe: NewRecipe): Promise<Recipe | null> => {
  const session = await getServerSession(options);
  if (!session) throw new Error('Not authenticated');

  try {
    const validatedRecipe = RecipeSchema.parse(recipe);
    const createdRecipe = await prisma.recipe.create({
      data: {
        ...validatedRecipe,
        authorId: Number(session.user.id),
        ingredients: validatedRecipe.ingredients.map((i) => (i.ingredient))
      }
    });
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