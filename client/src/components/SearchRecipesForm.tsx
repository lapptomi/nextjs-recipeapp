"use client";

import React, { useEffect, useState } from "react";

import { SearchOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ROUTES } from "@/types";

interface Props {
  totalCount: number;
}

type SortOption = "date_asc" | "date_desc";

const SearchRecipesForm = ({ totalCount }: Props) => {
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [recipeTitle, setRecipeTitle] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Math.ceil(totalCount / 12);

  useEffect(() => {
    setRecipeTitle(searchParams.get("title") || "");

    const sortParam = searchParams.get("sort_by");
    if (sortParam === "date_asc" || sortParam === "date_desc") {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  const createQuery = (params: URLSearchParams) => {
    const search = params.toString();
    return search ? `?${search}` : "";
  };

  const handleSubmit = () => {
    const current = new URLSearchParams();

    current.set("title", recipeTitle);
    current.set("sort_by", sortBy);
    router.push(`${pathname}${createQuery(current)}`);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    event.preventDefault();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", String(value));
    router.push(`${pathname}${createQuery(current)}`);
  };

  return (
    <Box className="flex flex-col items-center justify-center gap-4 bg-gray-100 p-6">
      <form
        className="flex max-w-[600px] flex-col flex-wrap justify-center gap-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <FormControl variant="standard">
          <InputLabel size="small">Sort By</InputLabel>
          <Select
            name="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
          >
            <MenuItem value="date_asc">Oldest first</MenuItem>
            <MenuItem value="date_desc">Newest first</MenuItem>
          </Select>
        </FormControl>

        <Box className="flex flex-row gap-2">
          <TextField
            label="Search"
            value={recipeTitle}
            onChange={(event) => setRecipeTitle(event.target.value)}
            placeholder="Enter recipe name..."
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              router.replace(ROUTES.RECIPES);
              setRecipeTitle("");
            }}
          >
            Clear
          </Button>
          <Button type="submit" variant="contained">
            Search
          </Button>
        </Box>
      </form>
      <Pagination
        onChange={(event, value) => handlePageChange(event, value)}
        count={pages}
        page={parseInt(searchParams.get("page") || "1")}
      />
    </Box>
  );
};

export default SearchRecipesForm;
