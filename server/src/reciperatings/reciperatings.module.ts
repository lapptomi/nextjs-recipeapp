import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reciperating } from './entities/reciperating.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reciperating])],
  providers: [],
})
export class ReciperatingsModule {}
