import { prisma } from "../src/config/db";
import { seed } from "../prisma/seed";

export const initTestDb = async () => {
  try {
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();
    await prisma.recipeComment.deleteMany();

    await seed();
  } catch (error) {
    console.error(error);
  }
};
