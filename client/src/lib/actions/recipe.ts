"use server";

import axios from "axios";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";

import { BASE_URL } from "../constants";

import type { CommentForm, RecipeRatingType } from "@/types";


export const createRecipe = async (formData: FormData) => {
  const response = await axios.post(`${BASE_URL}/api/recipes`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });

  return response.data;
};

export const addComment = async (data: CommentForm) => {
  const session = await getServerSession(options);

  const response = await axios.post(`${BASE_URL}/api/recipes/${data.recipeId}/comments`, {
    authorId: session?.user?.id,
    message: data.message,
  });

  return response.data;
};

interface ratingParams {
  recipeId: number;
  authorId: number;
  type: RecipeRatingType;
}

export const addRating = async (data: ratingParams) => {
  const response = await axios.post<ratingParams>(`${BASE_URL}/api/recipes/${data.recipeId}/ratings`, {
    authorId: data.authorId,
    type: data.type,
  });

  return response.data;
};