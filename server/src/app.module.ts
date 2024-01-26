import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/entities/recipe.entity';
import { ConfigModule } from '@nestjs/config';
import { RecipecommentsModule } from './recipecomments/recipecomments.module';
import { ReciperatingsModule } from './reciperatings/reciperatings.module';
import { Recipecomment } from './recipecomments/entities/recipecomment.entity';
import { Reciperating } from './reciperatings/entities/reciperating.entity';
import { S3Module } from './s3/s3.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Recipe, Recipecomment, Reciperating],
      ssl: process.env.NODE_ENV === 'production' ? true : false,
      synchronize: false,
    }),
    ThrottlerModule.forRoot([
      // Rate Limiter that by default is triggered for all the rest controllers and endpoints.
      // We can skip the limit by using the @SkipThrottle() decorator in some controller or endpoint.
      {
        ttl: 60 * 1000 * 5, // ttl = 5 minutes
        limit: 50, // Limit of requests before timeout (ttl / 5min) is triggered
      },
    ]),
    UsersModule,
    RecipesModule,
    RecipecommentsModule,
    ReciperatingsModule,
    S3Module,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
