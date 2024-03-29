import { IsNotEmpty, Length } from '@nestjs/class-validator';
import { Recipecomment } from '../../recipecomments/entities/recipecomment.entity';
import { Reciperating } from '../../reciperatings/entities/reciperating.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'recipe' })
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title' })
  @Length(1, 40)
  @IsNotEmpty()
  title: string;

  @Column({ name: 'description' })
  @Length(0, 255)
  description: string;

  @Column({ name: 'image', default: null })
  image: string;

  @Column({ name: 'servings', default: 0 })
  servings: number;

  @Column({ name: 'cooking_time', default: 0 })
  cookingTime: number;

  @Column('text', { name: 'ingredients', array: true })
  ingredients: string[];

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  @IsNotEmpty()
  author: User;

  @Column()
  @Length(1, 5000)
  instructions: string;

  @OneToMany(() => Recipecomment, (recipecomment) => recipecomment.recipe)
  comments: Recipecomment[];

  @OneToMany(() => Reciperating, (reciperating) => reciperating.recipe)
  ratings: Reciperating[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
