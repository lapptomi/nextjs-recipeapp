import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material";
import RecipeCard from "../../../../components/RecipeCard";
import type { RecipeListItem } from "../../../../types/recipe";

const RecipeGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 280px)",
  justifyContent: "center",
  gap: theme.spacing(3),
}));

interface Props {
  recipes: RecipeListItem[];
}

export default function UserRecipes({ recipes }: Props) {
  if (!recipes.length) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <Typography variant="h6" color="text.secondary">
          No recipes yet.
        </Typography>
      </Box>
    );
  }

  return (
    <RecipeGrid>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          width={280}
          imageHeight={172}
        />
      ))}
    </RecipeGrid>
  );
}
