import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { DecodedJwtTokenDto } from 'src/auth/dto/decoded-jwt-token.dto';
import { UsersService } from 'src/users/users.service';
import {
  RecipeRatingType,
  Reciperating,
} from 'src/reciperatings/entities/reciperating.entity';
import { Recipecomment } from 'src/recipecomments/entities/recipecomment.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Reciperating)
    private readonly recipeRatingRepository: Repository<Reciperating>,
    @InjectRepository(Recipecomment)
    private readonly recipeCommentRepository: Repository<Recipecomment>,
    private readonly s3Service: S3Service,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createRecipeDto: CreateRecipeDto,
    image: Express.Multer.File,
    token: DecodedJwtTokenDto,
  ) {
    const imageName = image ? image.originalname : null;
    const user = await this.usersService.findById(token.id);
    const createdRecipe = await this.recipeRepository.save({
      title: createRecipeDto.title,
      description: createRecipeDto.description,
      ingredients: createRecipeDto.ingredients,
      instructions: createRecipeDto.instructions,
      cookingTime: createRecipeDto.cookingTime,
      author: user,
      servings: createRecipeDto.servings,
      image: imageName,
    });

    // Upload image to S3 if image exists and recipe was created
    if (imageName && createdRecipe) {
      await this.s3Service.uploadImage(image, imageName);
    }

    return createdRecipe;
  }

  async findAll({ title = '', page = 1, pageSize = 12, sortBy = 'date_desc' }) {
    const [recipes, count] = await this.recipeRepository.findAndCount({
      where: {
        title: title ? title : undefined,
      },
      order: {
        createdAt: sortBy === 'date_asc' ? 'ASC' : 'DESC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
      relations: {
        comments: true,
        author: true,
        ratings: true,
      },
    });

    return {
      content: await this.s3Service.withImages(recipes),
      totalElements: count,
    };
  }

  async findById(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: {
        comments: {
          author: true,
        },
        ratings: {
          author: true,
        },
        author: true,
      },
    });

    return await this.s3Service.recipeWithSignedUrl(recipe);
  }

  async addRating(
    recipeId: number,
    rating: RecipeRatingType,
    token: DecodedJwtTokenDto,
  ) {
    const user = await this.usersService.findById(token.id);
    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });
    const existingRating = await this.recipeRatingRepository.findOne({
      where: {
        author: {
          id: user.id,
        },
        recipe: {
          id: recipe.id,
        },
      },
    });

    if (existingRating) {
      return this.recipeRatingRepository.update(existingRating.id, {
        ...existingRating,
        type: rating,
      });
    } else {
      return this.recipeRatingRepository.insert({
        type: rating,
        author: user,
        recipe: recipe,
      });
    }
  }

  async addComment(
    recipeId: number,
    message: string,
    token: DecodedJwtTokenDto,
  ) {
    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });
    const user = await this.usersService.findById(token.id);

    return await this.recipeCommentRepository.insert({
      message: message,
      author: user,
      recipe: recipe,
    });
  }
}
