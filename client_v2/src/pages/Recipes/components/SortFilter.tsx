import { useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

type SortOption = "date_asc" | "date_desc";

interface Props {
  sortBy?: string;
}

export default function SortFilter({ sortBy = "date_desc" }: Props) {
  const navigate = useNavigate();
  const [selectedSort, setSelectedSort] = useState<SortOption>(sortBy as SortOption);

  const handleSortChange = (value: SortOption) => {
    setSelectedSort(value);
    navigate({
      from: "/recipes/",
      to: "/recipes/",
      search: (prev) => ({ ...prev, sort_by: value }),
    });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Sort by:
      </Typography>
      <Select
        value={selectedSort}
        onChange={(e) => handleSortChange(e.target.value as SortOption)}
        size="small"
        sx={{ minWidth: 180, bgcolor: "background.paper" }}
      >
        <MenuItem value="date_desc">Newest first</MenuItem>
        <MenuItem value="date_asc">Oldest first</MenuItem>
      </Select>
    </Box>
  );
}
