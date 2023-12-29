/* eslint-disable no-null/no-null */
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getSignedImageUrl, uploadImageToS3 } from "@/lib/actions/aws_s3";
import { prisma } from "@/lib/db";
import { NewRecipeSchema } from "@/types";

import { options } from "../auth/[...nextauth]/options";

import type { NextRequest} from "next/server";
import type { URLSearchParams } from "url";

const parseQueryParams = (reqParams: URLSearchParams) => {
  const DEFAULT_PAGE = 1;
  const DEFAULT_PAGE_SIZE = 12;

  const page = parseInt(reqParams.get('page') || `${DEFAULT_PAGE}`);
  const pageSize = parseInt(reqParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`);
  const sortBy = reqParams.get('sortby') as 'date_asc' | 'date_desc' | undefined;
  const title = reqParams.get('title') || '';

  return { title, page, pageSize, sortBy };
};

type QueryParams = ReturnType<typeof parseQueryParams>;

const getRecipes = async ({ title, page, pageSize, sortBy }: QueryParams) => {
  const query = Prisma.validator<Prisma.RecipeFindManyArgs>()({
    orderBy: {
      createdAt: sortBy === 'date_asc' ? 'asc' : 'desc',
    },
    include: {
      author: true,
      ratings: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    where: {
      title: {
        mode: 'insensitive',
        contains: title,
      }
    },
  });

  const [recipes, totalCount] = await prisma.$transaction([
    prisma.recipe.findMany(query),
    prisma.recipe.count({ where: query.where }),
  ]);
  
  // TODO - refactor withImages to be reusable
  const withImages = await Promise.all(recipes.map(async (recipe) => {
    const preSignedUrl = recipe.image ? await getSignedImageUrl(recipe.image) : null;
    return { ...recipe, image: preSignedUrl };
  }));

  return {
    recipes: withImages,
    totalCount
  };
};

export type AllRecipesWithRelations = Prisma.PromiseReturnType<typeof getRecipes>;

export const GET = async (req: NextRequest) => {
  try {
    const params = parseQueryParams(req.nextUrl.searchParams);
    const recipes = await getRecipes(params);

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipes: ${error}` }, 
      { status: 400 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error('Not authenticated');

    const formData = await req.formData();
    const image = formData.get('image');
    const formRecipe = JSON.parse(formData.get('document') as any);

    const recipe = NewRecipeSchema.parse(formRecipe);
   
    // Create unique name for s3 bucket
    const imageName = recipe.image ? `${new Date().toISOString()}_${recipe.image.name}` : null;
    const createdRecipe = await prisma.recipe.create({
      data: {
        ...recipe,
        authorId: Number(session.user.id),
        ingredients: recipe.ingredients.map((i) => (i.ingredient)),
        image: imageName,
      }
    });

    // Upload image to s3 bucket if recipe was created successfully
    if (image && createdRecipe && imageName) {
      await uploadImageToS3(image, imageName);
    }

    return NextResponse.json(createdRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipes: ${error}` }, 
      { status: 400 }
    );
  }
};
