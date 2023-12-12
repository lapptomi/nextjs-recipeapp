import { getSignedImageUrl } from "./actions/aws_s3";

import type { Recipe } from "@prisma/client";

export const recipesWithPreSignedUrl = async (recipes: Recipe[]) => {
  // Get pre-signed URL for recipe background image from AWS S3
  const withImages = await Promise.all(recipes.map(async (recipe) => {
    const preSignedUrl = recipe.image && await getSignedImageUrl(recipe.image);
    return { ...recipe, image: preSignedUrl };
  }));

  return withImages;
};