import { useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

type CategoryValue =
  | "all"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack";

const CATEGORY_OPTIONS: { label: string; value: CategoryValue }[] = [
  { label: "All Recipes", value: "all" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Dessert", value: "dessert" },
  { label: "Snack", value: "snack" },
];

interface Props {
  category: string;
}

export default function RecipeFilters({ category }: Props) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryValue>(
    CATEGORY_OPTIONS.some((c) => c.value === category)
      ? (category as CategoryValue)
      : "all",
  );

  const handleChange = (value: CategoryValue) => {
    setSelected(value);
    navigate({
      from: "/recipes/",
      to: "/recipes",
      search: (prev) => ({ ...prev, category: value === "all" ? "" : value }),
    });
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Filter:
      </Typography>
      {CATEGORY_OPTIONS.map((c) => (
        <Chip
          key={c.value}
          label={c.label}
          size="small"
          onClick={() => handleChange(c.value)}
          variant={selected === c.value ? "filled" : "outlined"}
          color={selected === c.value ? "primary" : undefined}
        />
      ))}
    </Box>
  );
}
