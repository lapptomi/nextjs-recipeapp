"use client";

import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { Box, Chip, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

const categories = ["All Recipes", "Breakfast", "Salad", "Pasta", "Dessert", "Other"];

export default function RecipeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All Recipes"
  );
  const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "newest");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("title") || "");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All Recipes") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/recipes2?${params.toString()}`);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.push(`/recipes2?${params.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("title", query);
    } else {
      params.delete("title");
    }
    router.push(`/recipes2?${params.toString()}`);
  };

  return (
    <Box className="mb-8 flex flex-col gap-6">
      {/* Search Bar */}
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
        }}
      />

      {/* Filters and Sort */}
      <Box className="flex flex-wrap items-center justify-between gap-4">
        {/* Category Filters */}
        <Box className="flex flex-wrap items-center gap-2">
          <Typography variant="body2" className="mr-2 font-medium" color="text.secondary">
            Filter:
          </Typography>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategoryChange(category)}
              variant={selectedCategory === category ? "filled" : "outlined"}
              color={selectedCategory === category ? "primary" : "default"}
              sx={
                selectedCategory === category
                  ? {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }
                  : {
                      borderColor: "grey.300",
                      color: "text.primary",
                      "&:hover": {
                        bgcolor: "grey.100",
                      },
                    }
              }
              size="small"
            />
          ))}
        </Box>

        {/* Sort Dropdown */}
        <Box className="flex items-center gap-2">
          <Typography variant="body2" className="font-medium" color="text.secondary">
            Sort by:
          </Typography>
          <Select
            value={selectedSort}
            onChange={(e) => handleSortChange(e.target.value)}
            size="small"
            className="min-w-[180px] bg-white"
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.300",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "grey.400",
              },
            }}
          >
            <MenuItem value="newest">Newest first</MenuItem>
            <MenuItem value="oldest">Oldest first</MenuItem>
            <MenuItem value="popular">Most popular</MenuItem>
            <MenuItem value="rating">Highest rated</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}
