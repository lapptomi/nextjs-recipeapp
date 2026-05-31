import { createFileRoute } from "@tanstack/react-router";
import RecipesPage from "../../pages/Recipes";

type RecipesSearch = {
  title: string;
  category: string;
  sort_by: string;
  page: number;
  page_size: number;
};

export const Route = createFileRoute("/recipes/")({
  validateSearch: (search): RecipesSearch => ({
    title: String(search.title ?? ""),
    category: String(search.category ?? ""),
    sort_by: String(search.sort_by ?? "date_desc"),
    page: Number(search.page ?? 1),
    page_size: Number(search.page_size ?? 12),
  }),
  component: function Recipes() {
    const { title, category, sort_by, page, page_size } = Route.useSearch();
    return (
      <RecipesPage
        title={title}
        category={category}
        sortBy={sort_by}
        page={page}
        page_size={page_size}
      />
    );
  },
});
