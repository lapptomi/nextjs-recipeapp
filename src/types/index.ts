import { z } from "zod";

import type { Prisma } from "@prisma/client";

const NewRecipeImageSchema = z.object({
  lastModified: z.any().optional(),
  lastModifiedDate: z.any().optional(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  webkitRelativePath: z.any().optional(),
}).refine((file) => file.type === 'image/jpeg' || file.type === 'image/png', {
  message: 'Image must be of type image/jpeg or image/png',
}).refine((file) => file.size < 1_000_000, {
  message: 'Image size must be less than 1 MB',
}).refine((file) => file.name.length < 50, {
  message: 'Image name must be less than 50 characters',
}).nullable().optional();

export const NewRecipeSchema = z.object({
  title: z.string().min(4).max(18),
  description: z.string().max(50).optional(),
  ingredients: z.array(z.object({
    ingredient: z.string().min(4).max(18),
  })).min(1).max(200),
  instructions: z.string().min(4).max(4000),
  cookingTime: z.number().optional(),
  servings: z.number().optional(),
  image: NewRecipeImageSchema.nullable().optional(),
});

export const UserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(18),
  password: z.string().min(4).max(18),
});

export type NewUser = z.infer<typeof UserSchema>;

export type NewRecipe = z.infer<typeof NewRecipeSchema>;

export type RecipeIncludeRelations = Prisma.RecipeGetPayload<{
  include: {
    author: true;
    ratings: true;
    comments: {
      include: {
        author: true;
      }
    }
  }
}>;

export type UserIncludeRelations = Prisma.UserGetPayload<{
  include: {
    recipes: true;
    ratings: true;
    comments: true;
  }
}>;