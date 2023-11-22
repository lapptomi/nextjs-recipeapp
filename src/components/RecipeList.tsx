"use client";

import { useState } from 'react';

import { Pagination } from '@mui/material';

import RecipeListItem from './RecipeListItem';
import styles from '../styles/RecipeList.module.css';

import type { Recipe } from '@prisma/client';

interface Props {
  recipes: Recipe[];
}

const RecipeList: React.FC<Props> = ({ recipes }) => {
  const [pageNumber, setPageNumber] = useState(0);

  if (!recipes) {
    return <div>No recipes found</div>;
  }

  const pageSize = 9;
  const pageRecipes = recipes.slice(
    pageNumber * pageSize,
    pageNumber * pageSize + pageSize
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      margin: '30px 0px 30px 0px',
    }}>
      {/* TODO: add better pagination */}
      <Pagination
        count={Math.ceil(recipes.length / pageSize)}
        color="primary"
        onChange={(e, page) => setPageNumber(page - 1)}
      />
      <div className={styles.recipelist}>
        {pageRecipes.map((recipe) => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;