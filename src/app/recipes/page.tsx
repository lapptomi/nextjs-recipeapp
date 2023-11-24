import { Typography } from '@mui/material';

import { recipeActions } from '@/actions';
import RecipeListItem from '@/components/RecipeListItem';
import TitleHeader from '@/components/TitleHeader';

import styles from './page.module.css';

const BrowseRecipesPage = async () => {
  const recipes = await recipeActions.getAll();

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      {/* <SearchRecipesForm /> */}
      {/*  <RecipeList recipes={recipes} /> */}

      <div className={styles.recipelist}>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))) : (
          <div>
            <Typography variant="h4">No recipes found.</Typography>
            <Typography variant="body1">Be the first to create one!</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseRecipesPage;