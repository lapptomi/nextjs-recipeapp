import UndoIcon from "@mui/icons-material/Undo";
import { Box, Typography, styled } from "@mui/material";
import type { GeneratedRecipe } from "../../../../types/generate";

const VersionCardBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "selected",
})<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: Number(theme.shape.borderRadius) * 3,
  border: selected ? "2px solid" : "1px solid",
  borderColor: selected ? theme.palette.primary.main : theme.palette.grey[200],
  backgroundColor: "white",
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  cursor: "pointer",
  "&:hover": {
    borderColor: selected
      ? theme.palette.primary.main
      : theme.palette.grey[400],
  },
}));

interface Props {
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
}: Props) {
  return (
    <VersionCardBox onClick={onClick} selected={selected}>
      <Box>
        <Typography variant="body2">{recipe.title}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Version {version}
          </Typography>
          {saved && (
            <Typography variant="caption" color="success.main">
              Saved
            </Typography>
          )}
        </Box>
      </Box>
      {selected ? (
        <Typography
          variant="caption"
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          Selected
        </Typography>
      ) : (
        <UndoIcon sx={{ fontSize: 18, color: "text.disabled" }} />
      )}
    </VersionCardBox>
  );
}
