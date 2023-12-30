import { Typography } from '@mui/material';
import axios from 'axios';

import RecipeListItem from '@/components/RecipeListItem';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';

import styles from './page.module.css';

import type { AllRecipesWithRelations } from '../api/recipes/route';

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

// Force dynamic rendering
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic';

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  const response = await axios.get<AllRecipesWithRelations>(`${BASE_URL}/api/recipes?${queryParams}`);
  
  const recipes = response.data.recipes || [];
  const totalCount = response.data.totalCount || 1;

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={totalCount} />
    
      <div className={styles.container}>
        {recipes && recipes.length > 0 ? (
          <div className={styles.recipegrid}>
            {recipes.map((recipe) => (
              <RecipeListItem key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
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