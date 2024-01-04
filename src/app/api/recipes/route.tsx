import { NextResponse } from "next/server";

import recipeService from "../_services/recipeService";

import type { NextRequest} from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const recipes = await recipeService.getAll(req);
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipes: ${error}` }, 
      { status: 400 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const createdRecipe = await recipeService.create(req);
    return NextResponse.json(createdRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipes: ${error}` }, 
      { status: 400 }
    );
  }
};
