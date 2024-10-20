import { Suspense } from 'react';

import RecipeList from '@/components/RecipeList';
import RecipeListSkeleton from '@/components/RecipeListSkeleton';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import { getRecipes } from '@/lib/actions/recipe';

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

const Recipes = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  const recipes = await getRecipes(queryParams);

  return (
    <div>
      <SearchRecipesForm totalCount={recipes.totalElements} />
      <RecipeList recipes={recipes.content} />
    </div>
  );
};

const BrowseRecipesPage = ({ searchParams }: Params) => {
  return (
    <div key={Math.random()}>
      <Suspense fallback={
        <div>
          <SearchRecipesForm totalCount={0} />
          <RecipeListSkeleton />
        </div>
      }>
        <Recipes searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default BrowseRecipesPage;