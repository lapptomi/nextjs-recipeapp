import { Alert } from '@mui/material';
import axios from 'axios';

import RecipeList from '@/components/RecipeList';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';

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

const getAllRecipes = async (queryParams: string): Promise<any> => {
  try {
    const response = await axios.get<AllRecipesWithRelations>(`${BASE_URL}/api/recipes?${queryParams}`);
    return response.data;
  } catch (error) {
    return { error };
  }
};

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  const response = await getAllRecipes(queryParams);

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      
      {response.error?.message ? (
        <Alert severity="error">{response.error.message}</Alert>
      ) : (
        <>
          <SearchRecipesForm totalCount={response.totalCount} />
          <RecipeList recipes={response.recipes} />
        </>
      )}
    </div>
  );
};

export default BrowseRecipesPage;