import { Typography } from "@mui/material";



import { getSignedImageUrl } from "@/app/api/_services/aws_s3";
import RecipeListItem from "@/components/RecipeListItem";
import styles from '@/styles/RecipeList.module.css';

import type { Recipe } from "@/types";

interface Props {
  recipes: Recipe[];
}

const RecipeList = async ({ recipes }: Props) => {
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
        <div style={{ padding: 50 }}>
          <Typography variant="h3">No recipes found.</Typography>
          <Typography variant="body1">Be the first to create one!</Typography>
        </div>
      )}
    </div>
  );
};

export default RecipeList;