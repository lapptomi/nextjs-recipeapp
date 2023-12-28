/* eslint-disable no-null/no-null */
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

const getUser = async (userId: number) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    include: { 
      recipes: {
        include: {
          ratings: true,
          author: true
        }
      }
    }
  });

  // TODO - refactor withImages to be reusable
  const withImages = await Promise.all(user.recipes.map(async (recipe) => {
    const preSignedUrl = recipe.image ? await getSignedImageUrl(recipe.image) : null;
    return { ...recipe, image: preSignedUrl };
  }));

  return { ...user, recipes: withImages };
};

export type UserWithRelations = Prisma.PromiseReturnType<typeof getUser>;

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    const user = await getUser(Number(params.id));
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting user: ${error}` }, 
      { status: 400 }
    );
  }
};