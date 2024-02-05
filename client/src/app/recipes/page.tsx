import RecipeList from '@/components/RecipeList';
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

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');
  const recipes = await getRecipes(queryParams);

  return (
    <div>
      <SearchRecipesForm totalCount={recipes.totalElements} />
      <RecipeList recipes={recipes.content} />
    </div>
  );
};

export default BrowseRecipesPage;