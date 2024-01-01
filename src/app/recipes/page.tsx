"use client";

import { useEffect, useState } from 'react';

import { Alert, LinearProgress } from '@mui/material';
import axios from 'axios';

import RecipeList from '@/components/RecipeList';
import SearchRecipesForm from '@/components/SearchRecipesForm';
import TitleHeader from '@/components/TitleHeader';

import { BASE_URL } from '../../lib/constants';

import type { AllRecipesWithRelations } from '../api/recipes/route';

interface Params {
  searchParams: {
    page?: string;
    pageSize?: string;
    title?: string;
  };
}

const useGetRecipes = (queryParams: string) => {
  const [recipes, setRecipes] = useState<AllRecipesWithRelations['recipes']>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    axios.get<AllRecipesWithRelations>(`${BASE_URL}/api/recipes?${queryParams}`)
      .then((response) => {
        setRecipes(response.data.recipes);
        setTotalCount(response.data.totalCount);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [queryParams]);

  return { recipes, totalCount, loading, error };
};

const BrowseRecipesPage = ({ searchParams }: Params) => {
  const queryParams = Object.entries(searchParams).map(([key, value]) => `${key}=${value}`).join('&');  
  const { recipes, totalCount, loading, error } = useGetRecipes(queryParams);

  console.log('NEXTAUTH URL =', BASE_URL);

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      <SearchRecipesForm totalCount={totalCount} />

      {error && <Alert severity="error">{error}</Alert>}
      {loading 
        ? <LinearProgress /> 
        : <RecipeList recipes={recipes} />
      }
    </div>
  );
};

export default BrowseRecipesPage;