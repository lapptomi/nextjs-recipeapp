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
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeRatingType } from 'src/reciperatings/entities/reciperating.entity';
import { Request as ExpressRequest } from 'express';

@Controller('/recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('document') recipeJson: string,
    @UploadedFile() image: Express.Multer.File,
    @Request() request: ExpressRequest,
  ) {
    const recipe = JSON.parse(recipeJson) as CreateRecipeDto;
    return await this.recipesService.create(recipe, image, request.token);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findById(+id);
  }

  @Post(':id/ratings')
  @UseGuards(AuthGuard)
  async addRating(
    @Param('id') recipeId: string,
    @Body('type') type: RecipeRatingType,
    @Request() request: ExpressRequest,
  ) {
    return await this.recipesService.addRating(+recipeId, type, request.token);
  }

  @Post(':id/comments')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('id') recipeId: string,
    @Body('message') message: string,
    @Request() request: ExpressRequest,
  ) {
    return await this.recipesService.addComment(
      +recipeId,
      message,
      request.token,
    );
  }
}
