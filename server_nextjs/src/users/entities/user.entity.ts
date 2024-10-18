import { IsEmail, Length } from '@nestjs/class-validator';
import { Recipecomment } from '../../recipecomments/entities/recipecomment.entity';
import { Reciperating } from '../../reciperatings/entities/reciperating.entity';
import { Recipe } from '../../recipes/entities/recipe.entity';
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

  @Length(1, 40)
  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'email', unique: true })
  @IsEmail()
  email: string;

  @Column({ name: 'password', select: false })
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
