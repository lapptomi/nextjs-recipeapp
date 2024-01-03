import axios from 'axios';

import RecipeList from '@/components/RecipeList';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';

import type { AllRecipesWithRelations } from '@/app/api/recipes/route';

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
  
  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={response.data.totalCount} />
      <RecipeList recipes={response.data.recipes} />
    </div>
  );
};

export default BrowseRecipesPage;