import { Suspense } from "react";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Pagination,
  Rating,
  Skeleton,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { getRecipes } from "@/lib/actions/recipe";
import { ROUTES } from "@/types";

import type { RecipeListItem } from "@/types";

import RecipeFilters from "@/app/recipes/RecipeFilters";
import RecipePagination from "@/components/RecipePagination";

interface Params {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    title?: string;
    category?: string;
    sort?: string;
  }>;
}

export const dynamic = "force-dynamic";

// Grid configuration constants
const CARD_WIDTH = 350; // Card width in pixels
const CARD_GAP = 24; // Gap between cards in pixels (gap-6 = 24px)

const RecipeCard = ({ recipe }: { recipe: RecipeListItem }) => {
  return (
    <Link href={`${ROUTES.RECIPES}/${recipe.id}`} className="block h-full w-full">
      <Card className="h-full w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md">
        <Box className="relative h-[250px] bg-gray-100">
          {recipe.image ? (
            <CardMedia component="div" className="relative h-full w-full">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
                quality={80}
                loading="lazy"
              />
            </CardMedia>
          ) : (
            <Box className="flex h-full items-center justify-center">
              <RestaurantIcon className="text-gray-300" style={{ fontSize: 80 }} />
            </Box>
          )}

          <Chip
            label={"CATEGORY"}
            className="absolute left-3 top-3 bg-white/95 shadow-sm"
            size="small"
          />
        </Box>

        <CardContent className="flex flex-col gap-3 p-5">
          <Box className="flex flex-col gap-1">
            <Typography variant="h6" className="line-clamp-1 text-lg font-semibold text-gray-900">
              {recipe.title}
            </Typography>
            <Typography variant="body2" className="text-sm text-gray-500">
              @{recipe.author?.username}
            </Typography>
            <Typography variant="body2" className="text-sm text-gray-500">
              {recipe.description}
            </Typography>
          </Box>

          <Box className="flex items-center gap-2">
            <Rating
              value={recipe.averageRating}
              readOnly
              precision={0.5}
              size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography variant="body2" className="font-medium text-gray-700">
              {recipe.averageRating?.toFixed(1)}
            </Typography>
            <Typography variant="body2" className="text-gray-400">
              ({recipe.totalRatings})
            </Typography>
          </Box>

          <Box className="flex items-center gap-4">
            <Box className="flex items-center gap-1.5">
              <AccessTimeIcon className="text-gray-500" fontSize="small" />
              <Typography variant="body2" className="text-sm text-gray-600">
                {recipe.cookingTime} min
              </Typography>
            </Box>
            <Box className="flex items-center gap-1.5">
              <RestaurantIcon className="text-gray-500" fontSize="small" />
              <Typography variant="body2" className="text-sm text-gray-600">
                {recipe.servings} servings
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

const RecipeGrid = ({
  recipes,
  currentPage,
  totalPages,
  totalElements,
}: {
  recipes: RecipeListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}) => {
  console.log(recipes);

  if (!recipes || recipes.length === 0) {
    return (
      <Box className="flex justify-center py-20">
        <Box className="text-center">
          <Typography variant="h5" className="mb-2 font-bold text-gray-900">
            No recipes found
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Be the first to create one!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-8">
      <Box
        className="grid justify-center"
        sx={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
          gap: `${CARD_GAP}px`,
        }}
      >
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Box>

      <Box className="flex flex-col items-center justify-center gap-4">
        <RecipePagination currentPage={currentPage} totalPages={totalPages} />
        <Box>
          <Typography variant="body2" className="text-gray-600">
            Showing {currentPage * 12 - 12 + 1}-{currentPage * 12} of {totalElements} recipes
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const RecipeGridSkeleton = () => {
  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="w-full overflow-hidden rounded-2xl">
          <Skeleton variant="rectangular" height={288} />
          <CardContent className="flex flex-col gap-3 p-5">
            <Skeleton variant="text" width="80%" height={28} />
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="rectangular" width={120} height={20} />
            <Box className="flex gap-4">
              <Skeleton variant="text" width={60} height={20} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

const RecipesList = async ({ queryParams }: { queryParams: string }) => {
  const response = await getRecipes(queryParams);
  return (
    <RecipeGrid
      recipes={response.content}
      currentPage={response.page}
      totalPages={Math.ceil(response.totalElements / response.size)}
      totalElements={response.totalElements}
    />
  );
};

export default async function BrowseRecipesPage({ searchParams }: Params) {
  const params = await searchParams;
  const queryParams = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  console.log(params);

  return (
    <Box className="min-h-screen bg-gray-50 mx-8">
      <Container maxWidth="xl" className="py-8">
        <Box className="mb-8 flex flex-col gap-2">
          <Typography variant="h3" className="font-bold text-gray-900">
            Browse Recipes
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Discover delicious recipes from our community
          </Typography>
        </Box>

        <RecipeFilters />

        <Suspense fallback={<RecipeGridSkeleton />}>
          <RecipesList queryParams={queryParams} />
        </Suspense>
      </Container>
    </Box>
  );
}
