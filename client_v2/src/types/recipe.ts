import { z } from "zod";

export const NewRecipeSchema = z.object({
  title: z.string().min(4).max(50),
  description: z.string().max(500).optional(),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(1).max(30),
        amount: z.string().min(1).max(100),
      }),
    )
    .min(1),
  instructions: z
    .array(
      z.object({ instruction: z.string().min(4).max(5000), step: z.number() }),
    )
    .min(1),
  cookingTime: z.number().min(0).optional(),
  servings: z.number().min(0).optional(),
  category: z.string().optional(),
  image: z.instanceof(File).nullable().optional(),
});

export type NewRecipe = z.infer<typeof NewRecipeSchema>;

export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  cookingTime: number;
  servings: number;
  author: { id: number; username: string };
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  category: string | null;
}

export interface RecipeComment {
  id: number;
  message: string;
  author: { id: number; username: string };
  createdAt: string | null;
}

export interface RecipeRating {
  id: number;
  type: "LIKE" | "DISLIKE";
  userId: number;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  servings: number;
  image: string | null;
  author: { id: number; username: string };
  comments: RecipeComment[];
  ratings: RecipeRating[];
  createdAt: Date;
  category: string | null;
}
