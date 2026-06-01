import { Link, useNavigate } from "@tanstack/react-router";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Rating,
  Typography,
  styled,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { RecipeListItem } from "../../types/recipe";

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

const ImagePlaceholder = styled(Box)({
  display: "flex",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
});

const CategoryChip = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "rgba(255,255,255,0.95)",
  color: theme.palette.text.primary,
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
  padding: theme.spacing(2.5),
}));

const ClampedText = styled(Typography)({
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

interface Props {
  recipe: RecipeListItem;
  width?: number | string;
  imageHeight?: number;
  sx?: SxProps<Theme>;
}

export default function RecipeCard({
  recipe,
  width,
  imageHeight = 250,
  sx,
}: Props) {
  const navigate = useNavigate();

  return (
    <Box sx={{ width, ...sx }}>
      <Link
        to="/recipes/$id"
        params={{ id: String(recipe.id) }}
        style={{ textDecoration: "none", display: "block" }}
      >
        <StyledCard>
          <Box
            sx={{ position: "relative", overflow: "hidden", backgroundColor: "#f3f4f6", height: imageHeight }}
          >
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <ImagePlaceholder>
                <RestaurantIcon sx={{ fontSize: 80, color: "grey.300" }} />
              </ImagePlaceholder>
            )}

            {recipe.category && (
              <CategoryChip label={recipe.category} size="small" />
            )}
          </Box>

          <StyledCardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold" }}
                color="text.primary"
                noWrap
              >
                {recipe.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  navigate({
                    to: "/users/$id",
                    params: { id: String(recipe.author?.id) },
                  });
                }}
              >
                @{recipe.author?.username}
              </Typography>
              <ClampedText variant="caption">
                {recipe.description}
              </ClampedText>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating
                value={recipe.averageRating}
                readOnly
                precision={0.5}
                size="small"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarIcon fontSize="inherit" />}
              />
              <Typography variant="body2" color="text.secondary">
                {recipe.averageRating?.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.disabled">
                ({recipe.totalRatings})
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {recipe.cookingTime} min
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <RestaurantIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {recipe.servings} servings
                </Typography>
              </Box>
            </Box>
          </StyledCardContent>
        </StyledCard>
      </Link>
    </Box>
  );
}
