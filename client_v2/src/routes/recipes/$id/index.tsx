import { createFileRoute } from "@tanstack/react-router";
import { LinearProgress } from "@mui/material";
import { apiClient } from "../../../lib/apiClient";
import type { Recipe } from "../../../types/recipe";
import RecipePage from "./-RecipePage";

export const Route = createFileRoute("/recipes/$id/")({
  loader: ({ params }): Promise<Recipe> => {
    return apiClient.get(`/recipes/${params.id}`);
  },
  pendingComponent: () => <LinearProgress color="primary" />,
  component: function RouteComponent() {
    return <RecipePage recipe={Route.useLoaderData()} />;
  },
});
