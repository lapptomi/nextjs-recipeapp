import { Typography } from "@mui/material";

import RecipeListItem from "./RecipeListItem";
import styles from '../styles/RecipeList.module.css';

import type { AllRecipesWithRelations } from "@/app/api/recipes/route";

const RecipeList = ({ recipes }: Pick<AllRecipesWithRelations, "recipes">) => {
  return (
    <div className={styles.container}>
      {recipes && recipes.length > 0 ? (
        <div className={styles.recipegrid}>
          {recipes.map((recipe) => (
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