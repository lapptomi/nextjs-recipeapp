"use server";

import { apiClient } from "../apiClient";

import type { CommentForm, Recipe, RecipeListItem, RecipeRatingType } from "@/types";

interface Response {
  content: RecipeListItem[];
  totalElements: number;
  page: number;
  size: number;
  numberOfElements: number;
}

const endpoint = "/recipes";

export const getRecipes = async (queryParams?: string) => {
  const response = await apiClient.get<Response>(`${endpoint}?${queryParams}`);
  return response.data;
};

export const findRecipeById = async (recipeId: string) => {
  const response = await apiClient.get<Recipe>(`${endpoint}/${recipeId}`);
  return response.data;
};

export const createRecipe = async (formData: FormData) => {
  const response = await apiClient.post(`${endpoint}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const addComment = async (data: CommentForm) => {
  const response = await apiClient.post(`${endpoint}/${data.recipeId}/comments`, {
    message: data.message,
  });

  return response.data;
};

interface RatingParams {
  recipeId: number;
  type: RecipeRatingType;
}

export const addRating = async (data: RatingParams) => {
  const response = await apiClient.post(`${endpoint}/${data.recipeId}/ratings`, {
    type: data.type,
  });

  return response.data;
};

export const updateRating = async (data: RatingParams) => {
  const response = await apiClient.put(`${endpoint}/${data.recipeId}/ratings`, {
    type: data.type,
  });

  return response.data;
};
