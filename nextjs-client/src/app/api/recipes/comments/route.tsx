import { NextResponse } from "next/server";

import recipeService from "../../_services/recipeService";

import type { NextRequest} from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const createdComment = await recipeService.addComment(req);
    return NextResponse.json(createdComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      `Error creating comment: ${(error as any).message}`,
      { status: 400 }
    );
  }
};