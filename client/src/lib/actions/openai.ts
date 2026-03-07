"use server";

import { apiClient } from "../apiClient";
import type { GeneratedRecipe, RecipeChatTurn } from "@/types";

interface RecipeChatReply {
  message: string;
  recipe?: GeneratedRecipe;
}

const endpoint = "/openai";

export const generateRecipeChatReply = async (
  messages: RecipeChatTurn[]
): Promise<RecipeChatReply> => {
  const response = await apiClient.post<RecipeChatReply>(`${endpoint}/recipe-chat`, { messages });
  return response.data;
};
