import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { S3Service } from '../s3/s3.service';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  const testUsers: CreateUserDto[] = [
    {
      email: 'testuser1@asdsad.com',
      username: 'username1',
      password: 'password1',
    },
    {
      email: 'testuser12@asdsad.com',
      username: 'username2',
      password: 'password1',
    },
  ];

  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [UsersController],
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

    // Delete all users before each test
    await userService.deleteAll();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await userService.findAll();

      await userService.create(testUsers[0]);
      await userService.create(testUsers[1]);

      expect((await userService.findAll()).length).toEqual(result.length + 2);
    });
  });

  describe('create', () => {
    it('will create user with correct data', async () => {
      const users = await userService.findAll();
      await userService.create(testUsers[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);
    });

    it('wont create user with invaid email', async () => {
      const users = await userService.findAll();
      const badEmailUser = {
        email: 'asdasd',
        username: 'username1',
        password: 'password1',
      };
      await expect(userService.create(badEmailUser)).rejects.toThrow();
      expect((await userService.findAll()).length).toEqual(users.length);
    });

    it('will create user with invaid email', async () => {
      const users = await userService.findAll();
      await userService.create(testUsers[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);
    });

    it('wont create users with duplicate emails', async () => {
      const users = await userService.findAll();
      await userService.create(testUsers[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);

      await expect(
        userService.create({
          email: testUsers[0].email,
          username: testUsers[1].username,
          password: testUsers[1].password,
        }),
      ).rejects.toThrow();
    });

    it('wont create users with duplicate usernames', async () => {
      const users = await userService.findAll();
      await userService.create(testUsers[0]);
      expect((await userService.findAll()).length).toEqual(users.length + 1);

      await expect(
        userService.create({
          email: testUsers[1].email,
          username: testUsers[0].username,
          password: testUsers[1].password,
        }),
      ).rejects.toThrow();
    });

    it('wont create users with empty username', async () => {
      const users = await userService.findAll();
      await expect(
        userService.create({
          email: testUsers[0].email,
          username: '',
          password: testUsers[0].password,
        }),
      ).rejects.toThrow();
      expect((await userService.findAll()).length).toEqual(users.length);
    });

    it('wont create users with empty email', async () => {
      const users = await userService.findAll();
      await expect(
        userService.create({
          email: '',
          username: testUsers[0].username,
          password: testUsers[0].password,
        }),
      ).rejects.toThrow();
      expect((await userService.findAll()).length).toEqual(users.length);
    });
  });

  describe('findById', () => {
    it('will return user with correct id', async () => {
      const user = await userService.create(testUsers[0]);
      const result = await userService.findById(user.id);
      expect(user.id).toEqual(result.id);
      expect(user.email).toEqual(result.email);
    });

    it('will return undefined with incorrect id', async () => {
      await expect(userService.findById(123123)).rejects.toThrow();
    });
  });

  describe('findByEmail', () => {
    it('will return user with correct email', async () => {
      const user = await userService.create(testUsers[0]);
      const result = await userService.findByEmail(user.email);
      expect(user.id).toEqual(result.id);
      expect(user.email).toEqual(result.email);
    });

    it('will return undefined with incorrect id', async () => {
      await expect(userService.findByEmail('wrongemail')).rejects.toThrow();
    });
  });
});
