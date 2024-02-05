"use server";

import axios from "axios";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";

import config from "../config";

import type { CommentForm, Recipe, RecipeRatingType } from "@/types";

interface Response {
  content: Recipe[];
  totalElements: number;
}

export const getRecipes = async (queryParams?: string) => {
  const response = await axios.get<Response>(`${config.BASE_URL}/api/recipes?${queryParams}`);
  return response.data;
};

export const createRecipe = async (formData: FormData) => {
  const session = await getServerSession(options);
  const response = await axios.post(`${config.BASE_URL}/api/recipes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });

  return response.data;
};

export const addComment = async (data: CommentForm) => {
  const session = await getServerSession(options);
  const response = await axios.post(`${config.BASE_URL}/api/recipes/${data.recipeId}/comments`, {
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
  const session = await getServerSession(options);
  const response = await axios.post(`${config.BASE_URL}/api/recipes/${data.recipeId}/ratings`, {
    type: data.type,
  }, {
    headers: {
      Authorization: `Bearer ${session?.user.jwt}`,
    },
  });

  return response.data;
};