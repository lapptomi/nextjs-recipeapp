"use client";

import React, { useCallback, useEffect, useState } from "react";

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

const SearchRecipesForm = ({ totalCount }: Props) => {
  const [sortBy, setSortBy] = useState<"date_asc" | "date_desc">("date_desc");
  const [recipeTitle, setRecipeTitle] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Math.ceil(totalCount / 12);

  useEffect(() => {
    setRecipeTitle(searchParams.get("title") || "");
  }, [searchParams]);

  const createQuery = (params: URLSearchParams) => {
    const search = params.toString();
    return search ? `?${search}` : "";
  };

  const handleSubmit = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const paramsToUpdate = {
      title: recipeTitle,
      sort_by: sortBy,
      page: "1",
    };

    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      current.set(key, value);
    });

    router.push(`${pathname}${createQuery(current)}`);
  }, [searchParams, recipeTitle, sortBy, router, pathname]);

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
            onChange={(event) => setSortBy(event.target.value as any)}
          >
            <MenuItem value={"date_asc"}>Oldest</MenuItem>
            <MenuItem value={"date_desc"}>Newest</MenuItem>
          </Select>
        </FormControl>

        <Box className="flex flex-row">
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
          <Box>
            <Button
              type="button"
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
