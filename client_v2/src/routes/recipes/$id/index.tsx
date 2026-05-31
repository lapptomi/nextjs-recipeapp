import { createFileRoute } from "@tanstack/react-router";
import { LinearProgress } from "@mui/material";
import RecipePage from "../../../pages/Recipe";
import { API_URL } from "../../../constants";
import type { Recipe } from "../../../types";

export const Route = createFileRoute("/recipes/$id/")({
  loader: async ({ params }): Promise<Recipe> => {
    const res = await fetch(`${API_URL}/recipes/${params.id}`);
    return res.json();
  },
  pendingComponent: () => <LinearProgress color="primary" />,
  component: function RecipeRoute() {
    const recipe = Route.useLoaderData();
    return <RecipePage recipe={recipe} />;
  },
});
