import { Suspense } from "react";

import RecipeList from "@/components/RecipeList";
import RecipeListSkeleton from "@/components/RecipeListSkeleton";
import SearchRecipesForm from "@/components/SearchRecipesForm";
import { getRecipes } from "@/lib/actions/recipe";

interface Params {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    title?: string;
  }>;
}

export const dynamic = "force-dynamic";

const RecipesList = async ({ queryParams }: { queryParams: string }) => {
  const response = await getRecipes(queryParams);
  return (
    <div>
      <SearchRecipesForm totalCount={response.totalElements} />
      <RecipeList recipes={response.content} />
    </div>
  );
};

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(await searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return (
    <div key={queryParams}>
      <Suspense
        fallback={
          <div>
            <SearchRecipesForm totalCount={0} />
            <RecipeListSkeleton />
          </div>
        }
      >
        <RecipesList queryParams={queryParams} />
      </Suspense>
    </div>
  );
};

export default BrowseRecipesPage;
