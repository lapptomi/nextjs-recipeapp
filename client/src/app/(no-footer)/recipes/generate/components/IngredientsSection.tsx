import CircleIcon from "@mui/icons-material/Circle";
import { Box, Typography } from "@mui/material";

import CollapsibleSection from "./CollapsibleSection";

interface IngredientsSectionProps {
  ingredients: string[];
}

export default function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  return (
    <CollapsibleSection title="Ingredients" count={String(ingredients.length)} defaultOpen>
      <Box className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
        {ingredients.map((item, i) => (
          <Box key={i} className="flex items-center gap-4">
            <CircleIcon className="size-1.5" color="primary" />
            <Typography variant="body1" color="text.secondary">
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
    </CollapsibleSection>
  );
}
