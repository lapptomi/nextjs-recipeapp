import axios from 'axios';


import RecipeList from '@/components/RecipeList';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';

import type { Recipe } from '@/types';

//import type { AllRecipesWithRelations } from '../api/_services/recipeService';

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

interface Recipes {
  recipes: Recipe[];
  totalCount: number;
}

const fetchRecipes = async (queryParams: string): Promise<Recipes> => {
  const response = await axios.get(`${BASE_URL}/api/recipes?${queryParams}`);
  
  return {
    recipes: response.data,
    totalCount: response.headers['x-total-count'],
  };
};

// Force dynamic rendering
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic';

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  const response = await fetchRecipes(queryParams);

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={response.totalCount} />
      <RecipeList recipes={response.recipes} />
    </div>
  );
};

export default BrowseRecipesPage;