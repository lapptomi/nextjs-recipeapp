import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { getSignedImageUrl, uploadImageToS3 } from "@/lib/actions/aws_s3";
import { prisma } from "@/lib/db";
import { NewRecipeSchema } from "@/types";

import { options } from "../auth/[...nextauth]/options";

import type { NextRequest} from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const reqParams = req.nextUrl.searchParams;
    const page = parseInt(reqParams.get('page') || '1');
    const pageSize = parseInt(reqParams.get('pageSize') || '9');

    const recipes = await prisma.recipe.findMany({
      include: { author: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: {
        title: {
          mode: 'insensitive',
          contains: reqParams.get('title') || '',
        }
      },
    });

    const withImages = await Promise.all(recipes.map(async (recipe) => {
      // Get pre-signed URL for recipe background image from AWS S3
      const preSignedUrl = recipe.image && await getSignedImageUrl(recipe.image);
      return {
        ...recipe,
        image: preSignedUrl
      };
    }));

    return NextResponse.json(withImages, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipes: ${error}` }, 
      { status: 400 }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(options);
    if (!session) throw new Error('Not authenticated');

    const formData = await req.formData();
    const image = formData.get('image');
    const formRecipe = JSON.parse(formData.get('document') as any);

    const recipe = NewRecipeSchema.parse(formRecipe);
   
    // Create unique name for s3 bucket
    const imageName = recipe.image ? `${new Date().toISOString()}_${recipe.image.name}` : undefined;
    const createdRecipe = await prisma.recipe.create({
      data: {
        ...recipe,
        authorId: Number(session.user.id),
        ingredients: recipe.ingredients.map((i) => (i.ingredient)),
        image: imageName,
      }
    });

    // Upload image to s3 bucket if recipe was created successfully
    if (image && createdRecipe && imageName) {
      await uploadImageToS3(image, imageName);
    }

    return NextResponse.json(createdRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error getting recipes: ${error}` }, 
      { status: 400 }
    );
  }
};
