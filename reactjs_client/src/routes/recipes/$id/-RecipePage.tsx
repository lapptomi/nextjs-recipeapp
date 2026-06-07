import { Box, Container } from "@mui/material";
import type { Recipe } from "../../../types/recipe";
import RecipeHero from "./-components/RecipeHero";
import RecipeIngredients from "./-components/RecipeIngredients";
import RecipeInstructions from "./-components/RecipeInstructions";
import RecipeComments from "./-components/RecipeComments";

interface Props {
  recipe: Recipe;
}

export default function RecipePage({ recipe }: Props) {
  const likes = recipe.ratings.filter((r) => r.type === "LIKE").length;
  const dislikes = recipe.ratings.filter((r) => r.type === "DISLIKE").length;
  const averageRating =
    recipe.ratings.length > 0 ? (likes / (likes + dislikes)) * 5 : 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <RecipeHero
        recipe={recipe}
        averageRating={averageRating}
        likes={likes}
        dislikes={dislikes}
      />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipeInstructions instructions={recipe.instructions} />
        <RecipeComments recipeId={recipe.id} comments={recipe.comments} />
      </Container>
    </Box>
  );
}
