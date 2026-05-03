"use server";

import { apiClient } from "../apiClient";
import type { GeneratedRecipe, RecipeChatTurn } from "@/types";

interface RecipeChatReply {
  message: string;
  recipe?: GeneratedRecipe;
}

interface GeneratedImage {
  imageBase64: string;
}

const endpoint = "/openai";

export const generateRecipeChatReply = async (
  messages: RecipeChatTurn[]
): Promise<RecipeChatReply> => {
  const response = await apiClient.post<RecipeChatReply>(`${endpoint}/recipe-chat`, { messages });
  return response.data;
};

export const generateRecipeImage = async (
  recipe: Pick<GeneratedRecipe, "title" | "description" | "ingredients">
): Promise<GeneratedImage> => {
  const response = await apiClient.post<GeneratedImage>(
    `${endpoint}/generate-recipe-image`,
    recipe
  );
  return response.data;
};
