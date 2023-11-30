import { NextResponse } from "next/server";

import { getSignedImageUrl } from "@/lib/actions/aws_s3";
import { prisma } from "@/lib/db";

import type { NextRequest} from "next/server";

interface Params {
  params: {
    id: string;
  }
}

export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    const recipe = await prisma.recipe.findUniqueOrThrow({
      where: {
        id: Number(params.id)
      },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          }
        }
      },
    });
    const preSignedUrl = recipe.image && await getSignedImageUrl(recipe.image);

    return NextResponse.json(
      { ...recipe, image: preSignedUrl },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipe: ${error}` }, 
      { status: 400 }
    );
  }
};