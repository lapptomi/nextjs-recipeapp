import { z } from "zod";

const NewRecipeImageSchema = z
  .object({
    lastModified: z.any().optional(),
    lastModifiedDate: z.any().optional(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    webkitRelativePath: z.any().optional(),
  })
  .refine((file) => file.type === "image/jpeg" || file.type === "image/png", {
    message: "Image must be of type image/jpeg or image/png",
  })
  .refine((file) => file.size < 1_000_000, {
    message: "Image size must be less than 1 MB",
  })
  .refine((file) => file.name.length < 50, {
    message: "Image name must be less than 50 characters",
  })
  .nullable()
  .optional();

export const NewRecipeSchema = z.object({
  title: z.string().min(4).max(50),
  description: z.string().max(60).optional(),
  ingredients: z
    .array(
      z.object({
        ingredient: z.string().min(4).max(30),
        amount: z.string().min(0).max(10000),
      })
    )
    .min(1)
    .max(200),
  instructions: z
    .array(
      z.object({
        instruction: z.string().min(4).max(5000),
        step: z.number(),
      })
    )
    .min(1)
    .max(200),
  cookingTime: z.number().optional(),
  servings: z.number().min(0).optional(),
  image: NewRecipeImageSchema.nullable().optional(),
});

export const UserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(20),
  password: z.string().min(8).max(128),
});

export type NewUser = z.infer<typeof UserSchema>;

export type NewRecipe = z.infer<typeof NewRecipeSchema>;

export const CommentSchema = z.object({
  recipeId: z.number(),
  message: z.string().min(1).max(1000),
});

export type CommentForm = z.infer<typeof CommentSchema>;

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  bio: string | null;
  image: string | null;
  createdAt: Date;
  recipes: RecipeListItem[];
}

export interface RecipeComment {
  id: number;
  message: string;
  author: User;

  createdAt: string | null;
  updatedAt: string | null;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
}

export type RecipeRatingType = "LIKE" | "DISLIKE";

export interface RecipeRating {
  id: number;
  type: RecipeRatingType;
  author: Pick<User, "id">;
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
  author: User;
  username: string;
  comments: RecipeComment[];
  ratings: RecipeRating[];
  createdAt: Date;
}

export interface RecipeListItem {
  id: number;
  title: string;
  description: string;
  image: string | null;
  cookingTime: number;
  servings: number;
  author: Pick<User, "id" | "username">;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
}

export interface JwtTokenResponse {
  token: string;
  email: string;
  userId: number;
  username: string;
}

export enum ROUTES {
  HOME = "/",
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  RECIPES = "/recipes",
  CREATE_RECIPE = "/recipes/create",
  PROFILES = "/profiles",
}
