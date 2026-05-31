import { Box, Container, Typography } from "@mui/material";
import { styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import RecipeFilters from "./components/RecipeFilters";
import RecipeResults from "./components/RecipeResults";
import SearchInput from "./components/SearchInput";
import SortFilter from "./components/SortFilter";
import { API_URL } from "../../constants";
import type { RecipeListItem } from "../../types";

const FiltersRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  margin: `${theme.spacing(3)} 0`,
}));

interface Props {
  title: string;
  category: string;
  sortBy: string;
  page: number;
  page_size: number;
}

export default function RecipesPage({
  title,
  category,
  sortBy,
  page,
  page_size,
}: Props) {
  const { data: recipes, isLoading } = useQuery<RecipeListItem[]>({
    queryKey: ["recipes", title, category, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("title", title);
      params.set("category", category);
      params.set("sort_by", sortBy);
      params.set("page", page.toString());
      params.set("page_size", page_size.toString());

      const res = await fetch(`${API_URL}/recipes?${params}`);
      const data = await res.json();
      return data.content;
    },
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold" }}
            color="text.primary"
          >
            Browse Recipes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover delicious recipes from our community
          </Typography>
        </Box>

        <SearchInput title={title} />
        <FiltersRow>
          <RecipeFilters category={category} />
          <SortFilter sortBy={sortBy} />
        </FiltersRow>

        <RecipeResults recipes={recipes} isLoading={isLoading} />
      </Container>
    </Box>
  );
}
