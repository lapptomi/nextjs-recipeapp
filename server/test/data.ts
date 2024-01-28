import { CreateRecipeDto } from '../src/recipes/dto/create-recipe.dto';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

export const testUserDtos: CreateUserDto[] = [
  {
    email: 'testuser1@yolo.com',
    username: 'username1',
    password: 'password1',
  },
  {
    email: 'testuser12@yolo.com',
    username: 'username2',
    password: 'password2',
  },
];

export const testRecipeDtos: CreateRecipeDto[] = [
  {
    title: 'title1',
    description: 'description1',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: 'instructions1',
    cookingTime: 120,
    servings: 10,
  },
  {
    title: 'title2',
    description: 'description2',
    ingredients: ['ingredient1', 'ingredient2'],
    instructions: 'instructions2',
    cookingTime: 20,
    servings: 10,
  },
];
