import { Typography } from "@mui/material";

import RecipeListItem from "@/components/RecipeListItem";
import { getSignedImageUrl } from "@/lib/actions/aws_s3";
import styles from '@/styles/RecipeList.module.css';

import type { AllRecipesWithRelations } from "@/app/api/recipes/route";

const RecipeList = async ({ recipes }: Pick<AllRecipesWithRelations, "recipes">) => {
  const recipesWithImages = await Promise.all(recipes.map(async (recipe) => ({
    ...recipe,
    image: recipe.image && await getSignedImageUrl(recipe.image)
  })));

  return (
    <div className={styles.container}>
      {recipesWithImages && recipesWithImages.length > 0 ? (
        <div className={styles.recipegrid}>
          {recipesWithImages.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div>
          <Typography variant="h4">No recipes found.</Typography>
          <Typography variant="body1">Be the first to create one!</Typography>
        </div>
      )}
    </div>
  );
};

export default RecipeList;