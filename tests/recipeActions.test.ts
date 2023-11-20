import { beforeEach, describe, expect, test } from '@jest/globals';
import { recipeActions } from '../src/actions';
import { initTestDb } from './init_db';

describe.only('Recipe actions', () => {
  beforeEach((done) => {
    initTestDb().then(() => done());
  });

  test('returns right amount of recipes', async () => {
    expect((await recipeActions.getAll()).length).toBe(2);
  });

});