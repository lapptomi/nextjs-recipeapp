import { beforeEach, describe, expect, test } from '@jest/globals';

import { createSeed } from '../prisma/seed';
import { recipeActions } from '../src/actions';

describe.only('Recipe actions', () => {
  beforeEach((done) => {
    createSeed().then(() => done());
  });

  test('returns right amount of recipes', async () => {
    expect((await recipeActions.getAll()).length).toBe(2);
  });

});