import { Box } from "@mui/material";

import RecipeListCardSmall from "@/components/RecipeListCardSmall";
import { getRecipes } from "@/lib/actions/recipe";

const CARD_WIDTH = 280;
const CARD_GAP = 16;

export default async function PopularRecipes() {
  const response = await getRecipes("page=1&page_size=4");

  return (
    <Box
      className="grid justify-center"
      sx={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${CARD_WIDTH}px, ${CARD_WIDTH}px))`,
        gap: `${CARD_GAP}px`,
      }}
    >
      {response.content.map((recipe) => (
        <RecipeListCardSmall key={recipe.id} recipe={recipe} />
      ))}
    </Box>
  );
}
