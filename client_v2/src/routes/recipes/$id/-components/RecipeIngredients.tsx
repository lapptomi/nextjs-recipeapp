import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Box, Card, CardContent, Typography, styled } from "@mui/material";

const SectionCard = styled(Card)({
  marginBottom: 32,
  overflow: "hidden",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
});

const SectionIconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  width: 40,
  height: 40,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
}));

const IngredientBullet = styled(Box)(({ theme }) => ({
  marginTop: 8,
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: theme.palette.secondary.main,
}));

interface Props {
  ingredients: string[];
}

export default function RecipeIngredients({ ingredients }: Props) {
  const middleIndex = Math.ceil(ingredients.length / 2);
  const left = ingredients.slice(0, middleIndex);
  const right = ingredients.slice(middleIndex);

  return (
    <SectionCard>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <SectionIconWrapper>
            <RestaurantIcon sx={{ color: "white", fontSize: 20 }} />
          </SectionIconWrapper>
          <Typography variant="h5" color="text.primary">
            Ingredients
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {left.map((ingredient, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <IngredientBullet />
                <Typography variant="body1" color="text.secondary">
                  {ingredient}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {right.map((ingredient, i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <IngredientBullet />
                <Typography variant="body1" color="text.secondary">
                  {ingredient}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </SectionCard>
  );
}
