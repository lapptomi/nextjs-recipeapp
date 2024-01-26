import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipecomment } from './entities/recipecomment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipecomment])],
  providers: [],
})
export class RecipecommentsModule {}
