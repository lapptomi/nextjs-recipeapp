import { NextResponse } from "next/server";

import recipeService from "../../_services/recipeService";

import type { NextRequest} from "next/server";

interface Params {
  params: {
    id: string;
  }
}
export const GET = async (_req: NextRequest, { params }: Params) => {
  try {
    const recipe = await recipeService.findById(Number(params.id));
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipe: ${error}` }, 
      { status: 400 }
    );
  }
};