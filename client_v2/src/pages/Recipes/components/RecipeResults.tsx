import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material";
import RecipeCard from "../../../components/RecipeCard";
import RecipeCardSkeleton from "../../../components/RecipeCardSkeleton";
import type { RecipeListItem } from "../../../types";

const RecipeGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 280px)",
  justifyContent: "center",
  gap: theme.spacing(3),
}));

interface Props {
  recipes?: RecipeListItem[];
  isLoading: boolean;
}

export default function RecipeResults({ recipes, isLoading }: Props) {
  if (isLoading) {
    return (
      <RecipeGrid>
        {Array.from({ length: 8 }).map((_, i) => (
          <RecipeCardSkeleton key={i} width={280} imageHeight={172} />
        ))}
      </RecipeGrid>
    );
  }

  if (!recipes?.length) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 12, gap: 1 }}>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: "bold" }}>
          No recipes found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your search or filters
        </Typography>
      </Box>
    );
  }

  return (
    <RecipeGrid>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} width={280} imageHeight={172} />
      ))}
    </RecipeGrid>
  );
}
