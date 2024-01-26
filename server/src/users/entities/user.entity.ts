import { IsEmail, IsHash, Length } from '@nestjs/class-validator';
import { Recipecomment } from 'src/recipecomments/entities/recipecomment.entity';
import { Reciperating } from 'src/reciperatings/entities/reciperating.entity';
import { Recipe } from 'src/recipes/entities/recipe.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(1, 40)
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: true })
  password: string;

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  recipes: Recipe[];

  @OneToMany(() => Recipecomment, (recipecomment) => recipecomment.author)
  comments: Recipecomment[];

  @OneToMany(() => Recipecomment, (reciperating) => reciperating.author)
  ratings: Reciperating[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
