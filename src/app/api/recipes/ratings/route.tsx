import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";

import { options } from "../../auth/[...nextauth]/options";

import type { NextRequest} from "next/server";

export const POST = async (req: NextRequest) => {
  try {
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

    return NextResponse.json(createdRating, { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error adding rating: ${error}`, { status: 400 });
  }
};