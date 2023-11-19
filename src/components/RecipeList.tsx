"use client";

import { useState } from 'react';

import { Pagination } from '@mui/material';

import RecipeListItem from './RecipeListItem';
import styles from '../styles/RecipeList.module.css';

import type { Recipe } from '@prisma/client';

const recipeImages = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
  },
];

interface Props {
  recipes: Recipe[];
}

const RecipeList: React.FC<Props> = ({ recipes }) => {
  const [pageNumber, setPageNumber] = useState(0);

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
      {/* TODO: add better navigation */}
      <Pagination
        count={Math.ceil(recipes.length / pageSize)}
        color="primary"
        onChange={(e, page) => setPageNumber(page - 1)}
      />
      <div className={styles.recipelist}>
        {pageRecipes.map((recipe) => (
          <RecipeListItem
            key={recipe.id}
            recipe={{ ...recipe, img: recipeImages[0].img }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeList;