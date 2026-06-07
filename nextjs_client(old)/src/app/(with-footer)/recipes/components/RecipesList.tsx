import { getRecipes } from "@/lib/actions/recipe";

import RecipeGrid from "./RecipeGrid";

interface RecipesListProps {
  queryParams: string;
}

export default async function RecipesList({ queryParams }: RecipesListProps) {
  const response = await getRecipes(queryParams);

  return (
    <RecipeGrid
      recipes={response.content}
      currentPage={response.page}
      totalPages={Math.ceil(response.totalElements / response.size)}
      totalElements={response.totalElements}
    />
  );
}
