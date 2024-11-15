"use client";

import React, { useCallback, useEffect, useState } from "react";

import { SearchOutlined } from "@mui/icons-material";
import {
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

import { PAGES } from "@/types";

interface Props {
  totalCount: number;
}

const SearchRecipesForm = ({ totalCount }: Props) => {
  const [sortBy, setSortBy] = useState<"date_asc" | "date_desc">("date_desc");
  const [searchField, setSearchField] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pages = Math.ceil(totalCount / 12);

  useEffect(() => {
    setSearchField(searchParams.get("title") || "");
  }, [searchParams]);

  const createQuery = (params: URLSearchParams) => {
    const search = params.toString();
    return search ? `?${search}` : "";
  };

  // TODO: clean this mess
  const handleSubmit = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("title", searchField);
    current.set("sort_by", sortBy);
    current.set("page", "1");

    router.push(`${pathname}${createQuery(current)}`);
  }, [searchParams, searchField, sortBy, router, pathname]);

  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      event.preventDefault();
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("page", String(value));
      router.push(`${pathname}${createQuery(current)}`);
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-gray-100 p-6">
      <form className="flex max-w-[600px] flex-col flex-wrap justify-center gap-4">
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

        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            label="Search"
            value={searchField}
            onChange={(event) => setSearchField(event.target.value)}
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
          <div>
            <Button
              onClick={() => {
                router.replace(PAGES.RECIPES);
                setSearchField("");
              }}
            >
              Clear
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Search
            </Button>
          </div>
        </div>
      </form>
      <Pagination
        onChange={(event, value) => handlePageChange(event, value)}
        count={pages}
        page={parseInt(searchParams.get("page") || "1")}
      />
    </div>
  );
};

export default SearchRecipesForm;
