import { Suspense } from "react";

import { Skeleton, Typography } from "@mui/material";

import RecipeListItem from "@/components/RecipeListItem";
import styles from '@/styles/RecipeList.module.css';

import type { Recipe } from "@/types";

interface Props {
  request: (searchParams?: string) => Promise<Recipe[]>;
}

const RecipeList = async ({ request }: Props) => {
  const recipes = await request();
  
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

const RecipeListWithSuspense = ({ request }: Props) => {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', flexDirection: 'row', gap: 16, padding: 32 }}>
        {new Array(4).fill(0).map((_, index) => (
          <Skeleton key={index} variant="rectangular" width={300} height={300} />
        ))}
      </div>
    }>
      <RecipeList request={request} />
    </Suspense>
  );
};

export default RecipeListWithSuspense;