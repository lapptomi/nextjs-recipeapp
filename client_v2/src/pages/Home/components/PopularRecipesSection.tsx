import { Link } from "@tanstack/react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Button, Container, Typography, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import RecipeCard from "../../../components/RecipeCard";
import RecipeCardSkeleton from "../../../components/RecipeCardSkeleton";
import { API_URL } from "../../../constants";
import type { RecipeListItem } from "../../../types";

const SectionHeader = styled(Box)({
  display: "flex",
  width: "100%",
  maxWidth: 1200,
  alignItems: "center",
  justifyContent: "space-between",
});

const RecipeGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 280px)",
  justifyContent: "center",
  gap: theme.spacing(3),
}));

export default function PopularRecipesSection() {
  const { data: recipes, isLoading } = useQuery<RecipeListItem[]>({
    queryKey: ["recipes"],
    queryFn: () =>
      fetch(`${API_URL}/recipes?page=1&page_size=4`).then((response) =>
        response.json().then((data) => data.content)
      ),
  });

  return (
    <Box sx={{ bgcolor: "grey.50", py: 5 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <SectionHeader>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 0.5 }} color="text.primary">
                Latest Recipes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trending dishes our community loves
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/recipes"
              endIcon={<ArrowForwardIcon />}
              color="secondary"
            >
              View all
            </Button>
          </SectionHeader>
        </Box>

        {isLoading ? (
          <RecipeGrid>
            {Array.from({ length: 4 }).map((_, i) => (
              <RecipeCardSkeleton key={i} width={280} imageHeight={172} />
            ))}
          </RecipeGrid>
        ) : (
          <RecipeGrid>
            {recipes?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} width={280} imageHeight={172} />
            ))}
          </RecipeGrid>
        )}
      </Container>
    </Box>
  );
}
