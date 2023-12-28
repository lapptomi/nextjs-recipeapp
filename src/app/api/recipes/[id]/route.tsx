import { NextResponse } from "next/server";

import { getSignedImageUrl } from "@/lib/actions/aws_s3";
import { prisma } from "@/lib/db";

import type { Prisma } from "@prisma/client";
import type { NextRequest} from "next/server";

interface Params {
  params: {
    id: string;
  }
}

const getRecipe = async (recipeId: number) => {
  const recipe = await prisma.recipe.findUniqueOrThrow({
    where: {
      id: recipeId,
    },
    include: {
      ratings: true,
      author: true,
      comments: {
        include: {
          author: true,
        }
      }
    },
  });

  const preSignedUrl = recipe.image && await getSignedImageUrl(recipe.image);

  return {
    ...recipe,
    image: preSignedUrl
  };
};

export type RecipeWithRelations = Prisma.PromiseReturnType<typeof getRecipe>;

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    const recipe = await getRecipe(Number(params.id));
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipe: ${error}` }, 
      { status: 400 }
    );
  }
};