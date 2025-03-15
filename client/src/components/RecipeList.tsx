import { Box, Typography } from "@mui/material";

import RecipeListItem from "@/components/RecipeListItem";

import type { Recipe } from "@/types";

interface Props {
  recipes: Recipe[];
}

const RecipeList = async ({ recipes }: Props) => {
  return (
    <Box className="flex w-full justify-center">
      {recipes && recipes.length > 0 ? (
        <Box className="grid w-[1500px] grid-cols-auto-fill-300 justify-center gap-2 py-12">
          {recipes.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </Box>
      ) : (
        <Box className="p-12">
          <Typography variant="h4" fontWeight="bold">
            No recipes found.
          </Typography>
          <Typography variant="body1">Be the first to create one!</Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecipeList;
