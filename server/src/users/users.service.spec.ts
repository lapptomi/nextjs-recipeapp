import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { S3Service } from '../s3/s3.service';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { testUserDtos } from '../../test/data';

describe('UsersService', () => {
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        S3Service,
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);

    await userService.deleteAll();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userService.findAll();
      await userService.create(testUserDtos[0]);
      await userService.create(testUserDtos[1]);
      expect((await userService.findAll()).length).toEqual(result.length + 2);
    });

    it('Should not return users passwords', async () => {
      await userService.create(testUserDtos[0]);
      expect((await userService.findAll())[0].password).toBeFalsy();
    });
  });

  describe('create', () => {
    it('will create user with correct data', async () => {
      const users = await userService.findAll();
      await userService.create(testUserDtos[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);
    });

    it('wont create user with invaid email', async () => {
      const users = await userService.findAll();
      const badEmailUser = {
        email: 'invalidemail',
        username: 'username1',
        password: 'password1',
      };
      await expect(userService.create(badEmailUser)).rejects.toThrow();
      expect((await userService.findAll()).length).toEqual(users.length);
    });

    it('will create user with invaid email', async () => {
      const users = await userService.findAll();
      await userService.create(testUserDtos[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);
    });

    it('wont create users with duplicate emails', async () => {
      const users = await userService.findAll();
      await userService.create(testUserDtos[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);

      await expect(
        userService.create({
          email: testUserDtos[0].email,
          username: testUserDtos[1].username,
          password: testUserDtos[1].password,
        }),
      ).rejects.toThrow();
    });

    it('wont create users with duplicate usernames', async () => {
      const users = await userService.findAll();
      await userService.create(testUserDtos[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);

      await expect(
        userService.create({
          email: testUserDtos[1].email,
          username: testUserDtos[0].username,
          password: testUserDtos[1].password,
        }),
      ).rejects.toThrow();
    });

    it('wont create users with empty username', async () => {
      const users = await userService.findAll();
      await expect(
        userService.create({
          email: testUserDtos[0].email,
          username: '',
          password: testUserDtos[0].password,
        }),
      ).rejects.toThrow();
      expect((await userService.findAll()).length).toEqual(users.length);
    });

    it('wont create users with empty email', async () => {
      const users = await userService.findAll();
      await expect(
        userService.create({
          email: '',
          username: testUserDtos[0].username,
          password: testUserDtos[0].password,
        }),
      ).rejects.toThrow();
      expect((await userService.findAll()).length).toEqual(users.length);
    });
  });

  describe('findById', () => {
    it('will return user with correct id', async () => {
      const user = await userService.create(testUserDtos[0]);
      const result = await userService.findById(user.id);
      expect(user.id).toEqual(result.id);
      expect(user.email).toEqual(result.email);
    });

    it('will return undefined with incorrect id', async () => {
      await expect(userService.findById(123123)).rejects.toThrow();
    });
  });

  describe('findByEmailWithPassword', () => {
    it('will return user with correct email', async () => {
      const user = await userService.create(testUserDtos[0]);
      const result = await userService.findByEmailWithPassword(user.email);
      expect(user.id).toEqual(result.id);
      expect(user.email).toEqual(result.email);
    });

    it('will return undefined with incorrect id', async () => {
      await expect(
        userService.findByEmailWithPassword('wrongemail'),
      ).resolves.toBeFalsy();
    });

    it('will return user password', async () => {
      const user = await userService.create(testUserDtos[0]);
      const result = await userService.findByEmailWithPassword(user.email);
      expect(user.id).toEqual(result.id);
      expect(user.email).toEqual(result.email);
      expect(user.password).toBeTruthy();
    });
  });
});
