import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import {
  DeleteResult,
  ILike,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { DecodedJwtTokenDto } from '../auth/dto/decoded-jwt-token.dto';
import { UsersService } from '../users/users.service';
import {
  RecipeRatingType,
  Reciperating,
} from '../reciperatings/entities/reciperating.entity';
import { Recipecomment } from '../recipecomments/entities/recipecomment.entity';
import { validate } from 'class-validator';

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
    imageFile: Express.Multer.File,
    userId: number,
  ): Promise<Recipe> {
    const user = await this.usersService.findById(userId);
    const imageName = imageFile ? imageFile.originalname : null;

    const recipe = new Recipe();
    recipe.title = createRecipeDto.title;
    recipe.description = createRecipeDto.description;
    recipe.ingredients = createRecipeDto.ingredients;
    recipe.instructions = createRecipeDto.instructions;
    recipe.cookingTime = createRecipeDto.cookingTime;
    recipe.author = user;
    recipe.servings = createRecipeDto.servings;
    recipe.image = imageName;

    const errors = await validate(recipe);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const createdRecipe = await this.recipeRepository.save(recipe);
    // Upload image to S3 if image exists and recipe was created
    if (imageName && createdRecipe) {
      await this.s3Service.uploadImage(imageFile, imageName);
    }

    return createdRecipe;
  }

  async findAll({
    title = '',
    page = 1,
    pageSize = 12,
    sortBy = 'date_desc',
  }): Promise<{
    content: Recipe[];
    totalElements: number;
  }> {
    const [recipes, count] = await this.recipeRepository.findAndCount({
      where: {
        title: ILike(`%${title}%`),
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

  async findById(id: number): Promise<Recipe> {
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
  ): Promise<UpdateResult | InsertResult> {
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
  ): Promise<InsertResult> {
    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });
    const user = await this.usersService.findById(token.id);
    const recipeComment = new Recipecomment();
    recipeComment.message = message;
    recipeComment.author = user;
    recipeComment.recipe = recipe;

    const errors = await validate(recipeComment);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return await this.recipeCommentRepository.insert(recipeComment);
  }

  deleteAll(): Promise<DeleteResult> {
    return this.recipeRepository.delete({});
  }
}
