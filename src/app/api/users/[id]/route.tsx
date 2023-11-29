import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

import type { NextRequest} from "next/server";

interface Params {
  params: {
    id: string;
  }
}

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: Number(params.id)
      },
      include: { 
        recipes: {
          include: {
            author: true
          }
        }
      }
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting user: ${error}` }, 
      { status: 400 }
    );
  }
};