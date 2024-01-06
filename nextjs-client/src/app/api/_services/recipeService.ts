/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-null/no-null */
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";
import { NewRecipeSchema } from "@/types";

import { getSignedImageUrl, uploadImageToS3 } from "./aws_s3";
import { options } from "../auth/[...nextauth]/options";

import type { NextRequest} from "next/server";

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

const getRecipesBySearchParams = async ({ title, page, pageSize, sortBy }: QueryParams) => {
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

  return { recipes, totalCount };
};

export type AllRecipesWithRelations = Prisma.PromiseReturnType<typeof getRecipesBySearchParams>;

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


export default {
  async getAll(req: NextRequest) {
    const params = parseQueryParams(req.nextUrl.searchParams);
    const data = await getRecipesBySearchParams(params);
    return data;
  },

  async findById(id: number) {
    const recipe = await getRecipe(id);
    return recipe;
  },

  async create(req: NextRequest) {
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

    return createdRecipe;
  },

  addRating: async (req: NextRequest) => {
    const session = await getServerSession(options);
    if (!session) throw new Error("Not authenticated");

    const body = await req.json();

    const createdRating = await prisma.recipeRating.upsert({
      where: {
        authorId_recipeId: {
          authorId: Number(session.user.id),
          recipeId: Number(body.recipeId),
        }
      },
      update: {
        type: body.type,
      },
      create: {
        type: body.type,
        authorId: Number(session.user.id),
        recipeId: Number(body.recipeId),
      }
    });

    return createdRating;
  },

  addComment: async (req: NextRequest) => {
    const session = await getServerSession(options);
    if (!session) throw new Error("Not authenticated");
    
    const data = await req.json();
    const createdComment = await prisma.recipeComment.create({
      data: {
        ...data,
        authorId: Number(session.user.id)
      }
    });
    
    return createdComment;
  }

};