import UndoIcon from "@mui/icons-material/Undo";
import { Box, Typography } from "@mui/material";

import type { GeneratedRecipe } from "@/types";

interface RecipeVersionCardProps {
  recipe: GeneratedRecipe;
  version: number;
  selected: boolean;
  saved: boolean;
  onClick: () => void;
}

export default function RecipeVersionCard({
  recipe,
  version,
  selected,
  saved,
  onClick,
}: RecipeVersionCardProps) {
  return (
    <Box
      onClick={onClick}
      className="flex cursor-pointer items-center justify-between rounded-xl border bg-white px-4 py-3 transition-colors"
      sx={{
        borderColor: selected ? "primary.main" : "grey.200",
        borderWidth: selected ? 2 : 1,
        "&:hover": { borderColor: selected ? "primary.main" : "grey.400" },
        "&:hover .undo-icon": { color: "primary.main" },
      }}
    >
      <Box>
        <Typography variant="body2" fontWeight="medium">
          {recipe.title}
        </Typography>
        <Box className="flex items-center gap-2">
          <Typography variant="caption" color="text.secondary">
            Version {version}
          </Typography>
          {saved && (
            <Typography variant="caption" color="success.main" fontWeight="medium">
              Saved
            </Typography>
          )}
        </Box>
      </Box>
      {selected ? (
        <Typography variant="caption" color="primary" fontWeight="bold">
          Selected
        </Typography>
      ) : (
        <UndoIcon
          className="undo-icon"
          sx={{ fontSize: 18, color: "text.disabled", transition: "color 0.2s" }}
        />
      )}
    </Box>
  );
}
