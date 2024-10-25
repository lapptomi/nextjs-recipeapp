"use server";

import axios from "axios";

import { getSession } from "./auth";
import { API_URL } from "../constants";

import type { CommentForm, Recipe, RecipeRatingType } from "@/types";

interface Response {
  content: Recipe[];
  totalElements: number;
}

export const maxDuration = 60;

export const getRecipes = async (queryParams?: string) => {
  const response = await axios.get<Response>(`${API_URL}/recipes?${queryParams}`);
  return response.data;
};

export const findRecipeById = async (recipeId: string) => {
  const response = await axios.get<Recipe>(`${API_URL}/recipes/${recipeId}`);
  return response.data;
};

export const createRecipe = async (formData: FormData) => {
  const session = await getSession();
  const response = await axios.post(`${API_URL}/recipes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });

  return response.data;
};

export const addComment = async (data: CommentForm) => {
  const session = await getSession();
  const response = await axios.post(`${API_URL}/recipes/${data.recipeId}/comments`, {
    message: data.message,
  }, {
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });

  return response.data;
};

interface RatingParams {
  recipeId: number;
  type: RecipeRatingType;
}

export const addRating = async (data: RatingParams) => {
  const session = await getSession();
  const response = await axios.post(`${API_URL}/recipes/${data.recipeId}/ratings`, {
    type: data.type,
  }, {
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });

  return response.data;
};