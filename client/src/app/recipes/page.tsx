import { Suspense } from "react";

import { Box } from "@mui/material";

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
    <Box>
      <SearchRecipesForm totalCount={response.totalElements} />
      <RecipeList recipes={response.content} />
    </Box>
  );
};

const BrowseRecipesPage = async ({ searchParams }: Params) => {
  const queryParams = Object.entries(await searchParams)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return (
    <Box key={queryParams}>
      <Suspense
        fallback={
          <Box>
            <SearchRecipesForm totalCount={0} />
            <RecipeListSkeleton />
          </Box>
        }
      >
        <RecipesList queryParams={queryParams} />
      </Suspense>
    </Box>
  );
};

export default BrowseRecipesPage;
