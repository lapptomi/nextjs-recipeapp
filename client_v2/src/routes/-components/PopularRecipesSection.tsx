import { Link } from "@tanstack/react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useEmblaCarousel from "embla-carousel-react";
import RecipeCard from "../../components/RecipeCard";
import RecipeCardSkeleton from "../../components/RecipeCardSkeleton";
import { apiClient } from "../../lib/apiClient";
import type { RecipeListItem } from "../../types/recipe";

const SectionHeader = styled(Box)({
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
});

const NavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  "&:hover": { backgroundColor: theme.palette.grey[100] },
}));

export default function PopularRecipesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const { data: recipes, isLoading } = useQuery<RecipeListItem[]>({
    queryKey: ["latest_recipes"],
    queryFn: () =>
      apiClient
        .get("/recipes?page=1&page_size=12")
        .then((data) => data.content),
  });

  return (
    <Box sx={{ bgcolor: "grey.50", py: 5 }}>
      <Container maxWidth="xl">
        <SectionHeader sx={{ mb: 4 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 0.5, color: "text.primary" }}
            >
              Latest Recipes
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
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

        {isLoading ? (
          <Box sx={{ display: "flex", gap: 3 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} sx={{ flex: "0 0 280px" }}>
                <RecipeCardSkeleton width={280} imageHeight={172} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ position: "relative" }}>
            <NavButton
              sx={{ left: 20, zIndex: 1 }}
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ArrowBackIcon />
            </NavButton>

            <Box ref={emblaRef} sx={{ overflow: "hidden" }}>
              <Box sx={{ display: "flex", gap: 3 }}>
                {recipes?.map((recipe) => (
                  <Box key={recipe.id} sx={{ flex: "0 0 280px" }}>
                    <RecipeCard recipe={recipe} width={280} imageHeight={172} />
                  </Box>
                ))}
              </Box>
            </Box>

            <NavButton
              sx={{ right: 20 }}
              onClick={() => emblaApi?.scrollNext()}
            >
              <ArrowForwardIcon />
            </NavButton>
          </Box>
        )}
      </Container>
    </Box>
  );
}
