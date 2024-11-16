import { Suspense } from "react";

import Await from "@/components/Await";
import RecipeList from "@/components/RecipeList";
import RecipeListSkeleton from "@/components/RecipeListSkeleton";
import SearchRecipesForm from "@/components/SearchRecipesForm";
import { getRecipes } from "@/lib/actions/recipe";

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

export const dynamic = "force-dynamic";

const BrowseRecipesPage = ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const recipesPromise = getRecipes(queryParams);

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
        <Await promise={recipesPromise}>
          {({ data: resolvedRecipes }) => (
            <div>
              <SearchRecipesForm totalCount={resolvedRecipes.totalElements} />
              <RecipeList recipes={resolvedRecipes.content} />
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export default BrowseRecipesPage;
