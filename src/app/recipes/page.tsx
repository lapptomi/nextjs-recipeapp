import { recipeActions } from '@/actions';
import RecipeList from '@/components/RecipeList';
import TitleHeader from '@/components/TitleHeader';

const BrowseRecipesPage = async () => {
  const recipes = await recipeActions.getAll();

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      {/* <SearchRecipesForm /> */}
      {recipes.length > 0 ? (
        <RecipeList recipes={recipes} />
      ) : (
        <div>No recipes found</div>
      )}
    </div>
  );
};

export default BrowseRecipesPage;