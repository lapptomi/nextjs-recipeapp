import { Link } from "@tanstack/react-router";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import { Box, Card, CardContent, Chip, Rating, Typography, styled } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { RecipeListItem } from "../types";

const StyledCard = styled(Card)({
  height: "100%",
  width: "100%",
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid",
  borderColor: "#e5e7eb",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  transition: "box-shadow 0.2s",
  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
});

const ImageContainer = styled(Box)({
  position: "relative",
  overflow: "hidden",
  backgroundColor: "#f3f4f6",
});

const StatRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 16,
});

const StatItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 6,
});

interface Props {
  recipe: RecipeListItem;
  width?: number | string;
  imageHeight?: number;
  sx?: SxProps<Theme>;
}

export default function RecipeCard({ recipe, width, imageHeight = 250, sx }: Props) {
  return (
    <Box sx={{ width, ...sx }}>
    <Link to="/recipes/$id" params={{ id: String(recipe.id) }} style={{ textDecoration: "none", display: "block" }}>
      <StyledCard>
        <ImageContainer sx={{ height: imageHeight }}>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
            />
          ) : (
            <Box sx={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <RestaurantIcon sx={{ fontSize: 80, color: "grey.300" }} />
            </Box>
          )}

          {recipe.category && (
            <Chip
              label={recipe.category}
              size="small"
              sx={{ position: "absolute", top: 12, left: 12, bgcolor: "rgba(255,255,255,0.95)", color: "text.primary" }}
            />
          )}
        </ImageContainer>

        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} color="text.primary" noWrap>
              {recipe.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              @{recipe.author?.username}
            </Typography>
            <Typography variant="caption" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {recipe.description}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating value={recipe.averageRating} readOnly precision={0.5} size="small"
              icon={<StarIcon fontSize="inherit" />}
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <Typography variant="body2" color="text.secondary">{recipe.averageRating?.toFixed(1)}</Typography>
            <Typography variant="body2" color="text.disabled">({recipe.totalRatings})</Typography>
          </Box>

          <StatRow>
            <StatItem>
              <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">{recipe.cookingTime} min</Typography>
            </StatItem>
            <StatItem>
              <RestaurantIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">{recipe.servings} servings</Typography>
            </StatItem>
          </StatRow>
        </CardContent>
      </StyledCard>
    </Link>
    </Box>
  );
}
