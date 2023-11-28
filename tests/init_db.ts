import { prisma } from "../src/lib/db";

export const initTestDb = async () => {
  await prisma.recipeComment.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'testemail222@testmail.com',
      username: 'randomusername222',
      password: 'testpassword',
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'testemail1@test.com',
      username: 'testusername12',
      password: 'testpassword1',
    }
  });

  const recipe = await prisma.recipe.create({
    data: {
      title: 'title1',
      description: 'description1',
      ingredients: ['i1', 'i2', 'i3', 'i4'],
      instructions: 'instructions1',
      authorId: user.id,
      cookingTime: 30,
      servings: 6,
      comments: {
        create: [
          {
            authorId: user.id,
            message: 'This is a comment',
          },
          {
            authorId: user2.id,
            message: 'This is another comment',
          },
        ],
      }
    }
  });

  const recipe2 = await prisma.recipe.create({
    data: {
      title: 'title2',
      description: 'description2',
      ingredients: ['Chicken', 'water', 'salt', 'pepper'],
      instructions: 'instructions2',
      authorId: user2.id,
      cookingTime: 45,
      servings: 4,
    }
  });
};
