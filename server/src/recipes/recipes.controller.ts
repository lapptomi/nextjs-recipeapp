import {
  Controller,
  Get,
  Post,
  Param,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeRatingType } from '../reciperatings/entities/reciperating.entity';
import { Request as ExpressRequest } from 'express';
import { UpdateResult, InsertResult, DeleteResult } from 'typeorm';
import { Recipe } from './entities/recipe.entity';

@Controller('/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('document') recipeJson: string,
    @UploadedFile() image: Express.Multer.File,
    @Request() request: ExpressRequest,
  ): Promise<Recipe> {
    const recipe = JSON.parse(recipeJson) as CreateRecipeDto;
    return await this.recipesService.create(recipe, image, request.token.id);
  }

  @Get()
  findAll(
    @Query('title') title: string,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('sortby') sortBy: 'date_asc' | 'date_desc',
  ): Promise<{
    content: CreateRecipeDto[];
    totalElements: number;
  }> {
    return this.recipesService.findAll({ title, page, pageSize, sortBy });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CreateRecipeDto> {
    return this.recipesService.findById(+id);
  }

  @Post(':id/ratings')
  @UseGuards(AuthGuard)
  async addRating(
    @Param('id') recipeId: string,
    @Body('type') type: RecipeRatingType,
    @Request() request: ExpressRequest,
  ): Promise<UpdateResult | InsertResult> {
    return await this.recipesService.addRating(+recipeId, type, request.token);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('id') recipeId: string,
    @Body('message') message: string,
    @Request() request: ExpressRequest,
  ): Promise<InsertResult> {
    return await this.recipesService.addComment(
      +recipeId,
      message,
      request.token,
    );
  }

  @Delete()
  deleteAll(): Promise<DeleteResult> {
    return this.recipesService.deleteAll();
  }
}
