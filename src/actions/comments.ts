"use server";

import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { prisma } from "@/config/db";

export const createComment = async (data: any): Promise<any> => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error("Not authenticated");
    
    const createdComment = await prisma.recipeComment.create({ data: {
      ...data,
      authorId: Number(session.user.id),
    }});
    return createdComment;
  } catch (error) {
    throw new Error(error as any);
  }
};