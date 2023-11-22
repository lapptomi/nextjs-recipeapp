import { recipeActions } from '@/actions';
import RecipeList from '@/components/RecipeList';
import TitleHeader from '@/components/TitleHeader';

const BrowseRecipesPage = async () => {
  const recipes = await recipeActions.getAll();

  return (
    <div>
      <TitleHeader title="BROWSE RECIPES" />
      {/* <SearchRecipesForm /> */}
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default BrowseRecipesPage;