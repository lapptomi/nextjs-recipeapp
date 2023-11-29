import { Typography } from '@mui/material';

import RecipeListItem from '@/components/RecipeListItem';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';
import { prisma } from '@/lib/db';

import styles from './page.module.css';

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const totalCount = await prisma.recipe.count();
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');

  const recipes = await fetch(`${BASE_URL}/api/recipes?${queryParams}`, {
    cache: 'no-cache', // disable caching for dev purposes
  }).then((response) => response.json()
    .catch((error) => console.log('ERROR = ', error))
  );

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={totalCount} />
      <div className={styles.recipelist}>
        {recipes.length > 0 ? (
          recipes.map((recipe: any) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))) : (
          <div>
            <Typography variant="h4">No recipes found.</Typography>
            <Typography variant="body1">Be the first to create one!</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRecipesPage;