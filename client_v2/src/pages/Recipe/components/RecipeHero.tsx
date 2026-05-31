import { Link } from "@tanstack/react-router";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Avatar, Box, Button, Chip, Container, Rating, Typography, styled } from "@mui/material";
import type { Recipe } from "../../../types";

const HeroSection = styled(Box)({
  position: "relative",
  width: "100%",
  backgroundColor: "#111827",
});

const HeroImage = styled("img")({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.8,
});

const HeroOverlay = styled(Box)({
  position: "relative",
  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
});

const StatChip = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  borderRadius: theme.spacing(1),
  border: "1px solid rgba(255,255,255,0.2)",
  backgroundColor: "rgba(255,255,255,0.2)",
  padding: "4px 12px",
  backdropFilter: "blur(4px)",
  boxShadow: theme.shadows[3],
  color: "white",
}));

interface Props {
  recipe: Recipe;
  averageRating: number;
  likes: number;
  dislikes: number;
}

export default function RecipeHero({ recipe, averageRating, likes, dislikes }: Props) {
  return (
    <HeroSection>
      {recipe.image ? (
        <HeroImage src={recipe.image} alt={recipe.title} />
      ) : (
        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <RestaurantIcon sx={{ fontSize: 120, color: "grey.600" }} />
        </Box>
      )}

      <HeroOverlay>
        <Container maxWidth="lg" sx={{ display: "flex", minHeight: 460, flexDirection: "column", justifyContent: "space-between", gap: 2, py: 3 }}>
          <Box>
            <Button component={Link} to="/recipes" startIcon={<ArrowBackIcon />} variant="outlined" color="info" size="small">
              Back to Recipes
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, pb: 2 }}>
            {recipe.category && (
              <Chip size="small" label={recipe.category} sx={{ width: "fit-content", bgcolor: "primary.main", color: "white" }} />
            )}
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "text.primaryLight" }}>
              {recipe.title}
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondaryLight" }}>
              {recipe.description}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 40, height: 40 }}>
                {recipe.author.username[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondaryLight" }}>Recipe by</Typography>
                <Typography variant="body1" sx={{ color: "text.primaryLight" }}>@{recipe.author.username}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
              <StatChip>
                <AccessTimeIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{recipe.cookingTime}</Typography>
                <Typography variant="caption" sx={{ color: "text.primaryLight" }}>min</Typography>
              </StatChip>
              <StatChip>
                <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>{recipe.servings}</Typography>
                <Typography variant="caption" sx={{ color: "text.primaryLight" }}>servings</Typography>
              </StatChip>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating value={averageRating} readOnly precision={0.1} size="medium"
                  icon={<StarIcon fontSize="inherit" sx={{ color: "#facc15" }} />}
                  emptyIcon={<StarIcon fontSize="inherit" sx={{ color: "grey.400" }} />}
                />
                <Typography variant="body1" sx={{ color: "text.primaryLight" }}>
                  {averageRating.toFixed(1)} ({recipe.ratings.length})
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button startIcon={<ThumbUpIcon />} variant="outlined" color="info" size="small">{likes}</Button>
              <Button startIcon={<ThumbDownIcon />} variant="outlined" color="info" size="small">{dislikes}</Button>
            </Box>
          </Box>
        </Container>
      </HeroOverlay>
    </HeroSection>
  );
}
