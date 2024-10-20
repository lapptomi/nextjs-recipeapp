import { Skeleton } from "@mui/material";

import styles from '@/styles/RecipeListSkeleton.module.css';

const RecipeListSkeleton = () => {
  return (
    <div className={styles.recipelistskeleton}>
      {new Array(4).fill(0).map((_, index) => (
        <Skeleton key={index} variant="rectangular" width={300} height={300} />
      ))}
    </div>
  );
};

export default RecipeListSkeleton;