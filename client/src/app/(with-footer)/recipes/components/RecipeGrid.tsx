import { Box, Typography } from "@mui/material";

import type { RecipeListItem } from "@/types";

import RecipeCard from "./RecipeCard";
import RecipePagination from "./RecipePagination";

interface RecipeGridProps {
  recipes: RecipeListItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

const CARD_WIDTH = 350;
const CARD_GAP = 24;

export default function RecipeGrid({
  recipes,
  currentPage,
  totalPages,
  totalElements,
}: RecipeGridProps) {
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
}
