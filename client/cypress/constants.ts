import { API_ROOT } from "../src/lib/constants";

export const user = {
  username: 'testuser',
  email: 'testemail@test.com',
  password: 'randompassword',
};

export const recipe = {
  title: 'Test recipe',
  description: 'Test description',
  instructions: 'Test instructions',
};

export const LOCALHOST_BACKEND_URL = `http://localhost:8080/${API_ROOT}`;