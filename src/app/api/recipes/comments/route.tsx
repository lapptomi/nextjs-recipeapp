import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/db";

import { options } from "../../auth/[...nextauth]/options";

import type { NextRequest} from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error("Not authenticated");
    
    const data = await req.json();
    const createdComment = await prisma.recipeComment.create({
      data: { ...data, authorId: Number(session.user.id)}
    });
    
    return NextResponse.json(createdComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error creating comment: ${(error as any).message}`, { status: 400 });
  }
};