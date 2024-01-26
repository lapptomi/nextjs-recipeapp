import axios from 'axios';

import RecipeList from '@/components/RecipeList';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';
import { BASE_URL } from '@/lib/constants';

import type { Recipe } from '@/types';

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

interface Response {
  content: Recipe[],
  totalPages: number,
  totalElements: number,
}

// Force dynamic rendering
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = 'force-dynamic';

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  // const response = await axios.get<Response>(`${BASE_URL}/api/recipes?${queryParams}`);
  const response = await axios.get<any>(`${BASE_URL}/api/recipes`);

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={response.data.totalElements || 10} />
      <RecipeList recipes={response.data} />
    </div>
  );
};

export default BrowseRecipesPage;