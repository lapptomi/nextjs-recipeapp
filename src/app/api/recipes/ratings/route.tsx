import { NextResponse } from "next/server";

import recipeService from "../../_services/recipeService";

import type { NextRequest} from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const createdRating = await recipeService.addRating(req);
    return NextResponse.json(createdRating, { status: 201 });
  } catch (error) {
    return NextResponse.json(`Error adding rating: ${error}`, { status: 400 });
  }
};