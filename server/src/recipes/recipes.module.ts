import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { S3Module } from 'src/s3/s3.module';
import { UsersModule } from 'src/users/users.module';
import { Reciperating } from 'src/reciperatings/entities/reciperating.entity';
import { Recipecomment } from 'src/recipecomments/entities/recipecomment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Reciperating, Recipecomment]),
    S3Module,
    UsersModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
