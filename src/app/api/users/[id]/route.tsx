
import { NextResponse } from "next/server";

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

  return user;
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