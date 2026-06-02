import { Link } from "@tanstack/react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Typography,
  styled,
} from "@mui/material";
import type { Recipe } from "../../../../types/recipe";
import RecipeStats from "./RecipeStats";
import RatingButtons from "./RatingButtons";

const HeroImage = styled("img")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.8,
});

const HeroContainer = styled(Container)({
  display: "flex",
  minHeight: 460,
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 16,
  paddingTop: 24,
  paddingBottom: 24,
});

const FallbackIconContainer = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AuthorLinkBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 12,
  "&:hover": { opacity: 0.8 },
});

interface Props {
  recipe: Recipe;
  averageRating: number;
  likes: number;
  dislikes: number;
}

export default function RecipeHero({
  recipe,
  averageRating,
  likes,
  dislikes,
}: Props) {
  return (
    <Box
      sx={{ position: "relative", width: "100%", backgroundColor: "#111827" }}
    >
      {recipe.image ? (
        <HeroImage src={recipe.image} alt={recipe.title} />
      ) : (
        <FallbackIconContainer>
          <RestaurantIcon sx={{ fontSize: 120, color: "grey.600" }} />
        </FallbackIconContainer>
      )}

      <Box
        sx={{
          position: "relative",
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
        }}
      >
        <HeroContainer maxWidth="lg">
          <Box>
            <Button
              component={Link}
              to="/recipes"
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              color="info"
              size="small"
            >
              Back to Recipes
            </Button>
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, pb: 2 }}
          >
            {recipe.category && (
              <Chip
                size="small"
                label={recipe.category}
                sx={{
                  width: "fit-content",
                  bgcolor: "primary.main",
                  color: "white",
                }}
              />
            )}
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "text.primaryLight" }}
            >
              {recipe.title}
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondaryLight" }}>
              {recipe.description}
            </Typography>

            <Link
              to="/users/$id"
              params={{ id: String(recipe.author.id) }}
              style={{ textDecoration: "none" }}
            >
              <AuthorLinkBox>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 40,
                    height: 40,
                  }}
                >
                  {recipe.author.username[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondaryLight" }}
                  >
                    Recipe by
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.primaryLight" }}
                  >
                    @{recipe.author.username}
                  </Typography>
                </Box>
              </AuthorLinkBox>
            </Link>

            <RecipeStats recipe={recipe} averageRating={averageRating} />
            <RatingButtons recipe={recipe} likes={likes} dislikes={dislikes} />
          </Box>
        </HeroContainer>
      </Box>
    </Box>
  );
}
