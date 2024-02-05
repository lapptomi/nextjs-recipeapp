// eslint-disable-next-line import/no-anonymous-default-export
export default {
  APPLICATION_NAME: 'RecipeApp Pro',
  BASE_URL: process.env.NEXT_APP_API_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'secret',
};