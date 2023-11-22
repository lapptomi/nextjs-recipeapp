import { z } from "zod";

import type { Recipe, User } from "@prisma/client";

export const RecipeSchema = z.object({
  title: z.string().min(4).max(18),
  description: z.string().min(4).max(18),
  ingredients: z.array(z.object({
    ingredient: z.string().min(4).max(18),
  })).min(1).max(200),
  instructions: z.string().min(4).max(4000),
  cookingTime: z.number().optional(),
  servings: z.number().optional(),
  image: z.string().optional(),
});

export const UserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(18),
  password: z.string().min(4).max(18),
});

export type NewUser = z.infer<typeof UserSchema>;

export type NewRecipe = z.infer<typeof RecipeSchema>;

export interface RecipeWithAuthor extends Recipe {
  author?: User;
}