import { Suspense } from "react";

import { Box, Container, Typography } from "@mui/material";

import RecipeFilters from "./components/RecipeFilters";
import RecipeGridSkeleton from "./components/RecipeGridSkeleton";
import RecipesList from "./components/RecipesList";

interface Params {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
    title?: string;
    category?: string;
    sort_by?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function BrowseRecipesPage({ searchParams }: Params) {
  const params = await searchParams;
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return (
    <Box className="min-h-screen bg-gray-50">
      <Container maxWidth="xl" className="py-8">
        <Box className="mb-8 flex flex-col gap-2">
          <Typography
            variant="h3"
            className="font-bold text-gray-900"
            sx={{ fontSize: { xs: "1.75rem", md: "3rem" } }}
          >
            Browse Recipes
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Discover delicious recipes from our community
          </Typography>
        </Box>

        <RecipeFilters />

        <Suspense key={queryParams} fallback={<RecipeGridSkeleton />}>
          <RecipesList queryParams={queryParams} />
        </Suspense>
      </Container>
    </Box>
  );
}
