import { beforeEach, describe, expect, test } from '@jest/globals';

import { createSeed } from '../prisma/seed';
import { userActions } from '../src/actions';

import type { NewUser } from '@/types';

const user: NewUser = {
  username: 'test123',
  email: 'tes123123t@test.com',
  password: 'testpassword123',
};


describe('User Actions', () => {
  beforeEach((done) => {
    createSeed().then(() => done());
  });

  
  test('creates user with valid credentials', async () => {    
    expect((await userActions.getAll()).length).toBe(2);

    const createdUser = await userActions.create(user);
    expect(createdUser?.email).toBe(user.email);
    expect(createdUser?.username).toBe(user.username);

    expect((await userActions.getAll()).length).toBe(3);
  });
  
  test('does not create user with invalid email', async () => {
    expect((await userActions.getAll()).length).toBe(2);
    await expect(userActions.create({ ...user, email: 'invalidemail' })).rejects.toThrowError();
    expect((await userActions.getAll()).length).toBe(2);
  });

  test('does not create duplicate users', async () => {
    expect((await userActions.getAll()).length).toBe(2);

    const createdUser = await userActions.create(user);
    expect(createdUser?.email).toBe(user.email);
    expect(createdUser?.username).toBe(user.username);

    expect((await userActions.getAll()).length).toBe(3);
    await expect(userActions.create(user)).rejects.toThrow();
    expect((await userActions.getAll()).length).toBe(3);
  });

});