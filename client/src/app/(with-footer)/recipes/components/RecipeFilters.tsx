"use client";

import { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/types";
import ClearIcon from "@mui/icons-material/Clear";

type SortOption = "date_asc" | "date_desc";

const categoryOptions = [
  { label: "All Recipes", value: "all" },
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Dessert", value: "dessert" },
  { label: "Snack", value: "snack" },
] as const;

type CategoryValue = (typeof categoryOptions)[number]["value"];

const validCategoryValues = new Set<CategoryValue>(
  categoryOptions.map((category) => category.value)
);

function isCategoryValue(value: string): value is CategoryValue {
  return validCategoryValues.has(value as CategoryValue);
}

export default function RecipeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromQuery = searchParams.get("category")?.toLowerCase() ?? "all";
  const initialCategory: CategoryValue = isCategoryValue(categoryFromQuery)
    ? categoryFromQuery
    : "all";

  const [selectedCategory, setSelectedCategory] = useState<CategoryValue>(initialCategory);
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort_by") || "date_desc");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("title") || "");

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("title", searchQuery);
      } else {
        params.delete("title");
      }
      router.push(`${ROUTES.RECIPES}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleCategoryChange = (category: CategoryValue) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`${ROUTES.RECIPES}?${params.toString()}`);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", sort);
    router.push(`${ROUTES.RECIPES}?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box className="mb-8 flex flex-col gap-6">
      <TextField
        placeholder="Search recipes by name, ingredient, or author..."
        variant="outlined"
        fullWidth
        size="medium"
        className="bg-white"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-400" />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery("")}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box className="flex flex-wrap items-center justify-between gap-4">
        <Box className="flex flex-wrap items-center gap-2">
          <Typography variant="body2" className="mr-2 font-medium" color="text.secondary">
            Filter:
          </Typography>
          {categoryOptions.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => handleCategoryChange(category.value)}
              variant={selectedCategory === category.value ? "filled" : "outlined"}
              color={selectedCategory === category.value ? "primary" : undefined}
              size="small"
            />
          ))}
        </Box>

        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="font-medium" color="text.secondary">
            Sort by:
          </Typography>
          <Select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            size="small"
            className="min-w-[180px] bg-white"
          >
            <MenuItem value="date_desc">Newest first</MenuItem>
            <MenuItem value="date_asc">Oldest first</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
