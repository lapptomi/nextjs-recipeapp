/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Recipe, User } from '@prisma/client';

const prisma = new PrismaClient();

export const createSeed = async () => {
  try {
    await prisma.recipe.deleteMany();
    await prisma.user.deleteMany();
    await prisma.recipeComment.deleteMany();

    await seed();
  } catch (error) {
    await prisma.$disconnect();
    process.exit(1);
  }
};

createSeed();


const seed = async () => {
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
      title: 'Chicken soup',
      description: 'A delicious chicken soup',
      ingredients: ['Pizza', '1 dl water', '2 spoons of salt', '2 spoons of pepper'],
      instructions: `
        Prepare the pizza dough using the pizza base kit and water following packet directions.
        
        Turn dough onto a lightly floured surface and knead until smooth.
        Use a rolling pin to roll out to a 25cm disc.
        Place on the prepared tray. Set aside in a warm place for 10 mins.
      `,
      authorId: user.id,
      cookingTime: 30,
      servings: 6,
      image: "recipeimage.jpeg",
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
      title: 'Shrimp salad',
      description: 'A easy and delicious shrimp salad',
      ingredients: ['Chicken', 'water', 'salt', 'pepper'],
      instructions: `
      Instructions: 1. In a large mixing bowl, combine the flour, yeast, sugar, and salt. Mix well.

      2. Gradually add warm water and olive oil to the dry ingredients. Stir until a sticky dough forms.
      
      3. Transfer the dough onto a lightly floured surface and knead for about 5 minutes until it becomes smooth and elastic.
      
      4. Place the dough in a greased bowl, cover it with a clean kitchen towel, and let it rise in a warm place for about 1 hour or until it doubles in size.
      
      5. Preheat your oven to 475°F (245°C) and prepare your pizza toppings.
      
      6. Once the dough has risen, punch it down and divide it into two equal portions for two medium-sized pizzas or leave it as is for one large pizza.
      
      7. Roll out the dough on a floured surface into your desired shape and thickness. Transfer it onto a baking sheet or pizza stone.
      
      8. Spread tomato sauce evenly over the dough, leaving a small border for the crust. Add your desired cheese and toppings on top.
      
      9. Bake the pizza in the preheated oven for about 12-15 minutes, or until the crust is golden brown and the cheese is melted and bubbly.
      
      10. Remove from the oven and let it cool for a few minutes before slicing and serving. Enjoy your homemade pizza!
      `,
      authorId: user2.id,
      image: "recipeimage2.jpeg",
      cookingTime: 45,
      servings: 4,
    }
  });
};
