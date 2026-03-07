import { type ReactElement, type ReactNode } from "react";

import { Chip } from "@mui/material";

interface RecipeStatChipProps {
  icon: ReactElement;
  children: ReactNode;
}

export default function RecipeStatChip({ icon, children }: RecipeStatChipProps) {
  return (
    <Chip
      icon={icon}
      label={children}
      size="small"
      className="h-9 rounded-full border border-white/20 bg-white/20 px-2 text-white shadow-lg backdrop-blur-sm"
      sx={{
        "& .MuiChip-icon": { color: "white" },
        "& .MuiChip-label": { color: "white" },
      }}
    />
  );
}
