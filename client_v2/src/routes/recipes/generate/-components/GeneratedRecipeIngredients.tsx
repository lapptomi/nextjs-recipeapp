import CircleIcon from "@mui/icons-material/Circle";
import { Box, Typography, styled } from "@mui/material";
import CollapsibleSection from "./CollapsibleSection";

const IngredientsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  columnGap: theme.spacing(3),
  rowGap: theme.spacing(1),
  marginTop: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "1fr 1fr",
  },
}));

export default function GeneratedRecipeIngredients({
  ingredients,
}: {
  ingredients: string[];
}) {
  return (
    <CollapsibleSection
      title="Ingredients"
      count={String(ingredients.length)}
      defaultOpen
    >
      <IngredientsGrid>
        {ingredients.map((item, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CircleIcon sx={{ fontSize: 6 }} color="primary" />
            <Typography variant="body1" color="text.secondary">
              {item}
            </Typography>
          </Box>
        ))}
      </IngredientsGrid>
    </CollapsibleSection>
  );
}
