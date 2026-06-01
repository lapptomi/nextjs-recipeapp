import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StarIcon from "@mui/icons-material/Star";
import { Box, Rating, Typography, styled } from "@mui/material";
import type { Recipe } from "../../../../types/recipe";

const StatsContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 12,
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
}

export default function RecipeStats({ recipe, averageRating }: Props) {
  return (
    <StatsContainer>
      <StatChip>
        <AccessTimeIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {recipe.cookingTime}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.primaryLight" }}>
          min
        </Typography>
      </StatChip>
      <StatChip>
        <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {recipe.servings}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.primaryLight" }}>
          servings
        </Typography>
      </StatChip>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Rating
          value={averageRating}
          readOnly
          precision={0.1}
          size="medium"
          icon={<StarIcon fontSize="inherit" sx={{ color: "#facc15" }} />}
          emptyIcon={<StarIcon fontSize="inherit" sx={{ color: "grey.400" }} />}
        />
        <Typography variant="body1" sx={{ color: "text.primaryLight" }}>
          {averageRating.toFixed(1)} ({recipe.ratings.length})
        </Typography>
      </Box>
    </StatsContainer>
  );
}
