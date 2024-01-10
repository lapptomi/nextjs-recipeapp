import { Typography } from "@mui/material";

import RecipeListItem from "@/components/RecipeListItem";
import styles from '@/styles/RecipeList.module.css';

import type { Recipe } from "@/types";

interface Props {
  recipes: Recipe[];
}

const RecipeList = async ({ recipes }: Props) => {
  return (
    <div className={styles.container}>
      {recipes && recipes.length > 0 ? (
        <div className={styles.recipegrid}>
          {recipes.map((recipe) => (
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