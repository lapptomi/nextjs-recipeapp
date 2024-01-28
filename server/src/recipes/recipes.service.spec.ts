import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '../s3/s3.service';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';
import { Reciperating } from '../reciperatings/entities/reciperating.entity';
import { Recipecomment } from '../recipecomments/entities/recipecomment.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { testRecipeDtos, testUserDtos } from '../../test/data';

describe('RecipesService', () => {
  let userService: UsersService;
  let recipeService: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule],
      controllers: [],
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Reciperating),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Recipecomment),
          useValue: {},
        },
        S3Service,
      ],
    }).compile();

    recipeService = module.get<RecipesService>(RecipesService);
    userService = module.get<UsersService>(UsersService);

    // Will delete recipes also because of cascade
    await userService.deleteAll();
  });

  describe('findAll', () => {
    it('should return an array of recipes', async () => {
      const result = await recipeService.findAll({});
      expect(result).toEqual({
        content: [],
        totalElements: 0,
      });
    });
  });

  describe.only('create', () => {
    it('will create recipe with correct data', async () => {
      const recipes = (await recipeService.findAll({})).totalElements;
      const author = await userService.create(testUserDtos[1]);

      await recipeService.create(testRecipeDtos[0], null, author.id);
      expect((await recipeService.findAll({})).totalElements).toEqual(
        recipes + 1,
      );
    });

    it('will not create recipe with inavalid author id', async () => {
      const recipes = await recipeService.findAll({});
      await expect(
        recipeService.create(testRecipeDtos[0], null, 999999),
      ).rejects.toThrow();

      expect((await recipeService.findAll({})).totalElements).toEqual(
        recipes.totalElements,
      );
    });

    it('will not create recipe with missing author id', async () => {
      const recipes = await recipeService.findAll({});
      await expect(
        recipeService.create(testRecipeDtos[0], null, undefined),
      ).rejects.toThrow();

      expect((await recipeService.findAll({})).totalElements).toEqual(
        recipes.totalElements,
      );
    });
  });
});
