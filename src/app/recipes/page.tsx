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
        {recipes.map((recipe) => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default BrowseRecipesPage;