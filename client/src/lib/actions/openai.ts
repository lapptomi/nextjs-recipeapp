"use server";

import { apiClient } from "../apiClient";
import type { Recipe } from "@/types";

export interface RecipeChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  adjustments: string[];
}

interface RecipeChatReply {
  message: string;
  recipe?: GeneratedRecipe;
}

export interface SaveGeneratedRecipePayload {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  category?: string;
}

const endpoint = "/openai"; ///recipe-chat";

export const generateRecipeChatReply = async (
  messages: RecipeChatTurn[]
): Promise<RecipeChatReply> => {
  const response = await apiClient.post<RecipeChatReply>(`${endpoint}/recipe-chat`, { messages });
  return response.data;
};

export const saveGeneratedRecipe = async (payload: SaveGeneratedRecipePayload): Promise<Recipe> => {
  const response = await apiClient.post<Recipe>(`${endpoint}/save-generated-recipe`, payload);
  return response.data;
};
