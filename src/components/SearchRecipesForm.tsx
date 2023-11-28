"use client";

import React from "react";

import { SearchOutlined } from "@mui/icons-material";
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from '@/styles/SearchRecipesForm.module.css';

interface Props {
  totalCount: number;
  pageSize: number;
}

const SearchRecipesForm: React.FC<Props> = ({ totalCount, pageSize }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set("selected", "123");

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "";

    // Add query params here
    router.push(`${pathname}${query}&test=lol`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.filterform}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>

          <FormControl variant="standard" style={{ minWidth: 120 }}>
            <InputLabel size="small">Sort By</InputLabel>
            <Select value={10}>
              <MenuItem value={10}>Date Newest</MenuItem>
              <MenuItem value={20}>Date Oldest</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

          <div>
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel size="small">Type</InputLabel>
              <Select label="Date" value={0}>
                <MenuItem value={0}>
                  <em>-</em>
                </MenuItem>
                <MenuItem value={10}>Fish</MenuItem>
                <MenuItem value={20}>Date Oldest</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div>
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel size="small">Category</InputLabel>
              <Select label="Date" value={0}>
                <MenuItem value={0}>
                  <em>-</em>
                </MenuItem>
                <MenuItem value={10}>Fish</MenuItem>
                <MenuItem value={20}>Date Oldest</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div>
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel size="small">Allergies</InputLabel>
              <Select label="Date" value={0}>
                <MenuItem value={0}>
                  <em>-</em>
                </MenuItem>
                <MenuItem value={10}>Fish</MenuItem>
                <MenuItem value={20}>Date Oldest</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div>
          <TextField
            style={{ width: 300  }}
            label="Search"
            placeholder='Enter recipe name or ingredient...'
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
          />
          <Button onClick={() => router.replace('/recipes')}>
            Clear
          </Button>
          <Button variant="contained" onClick={() => handleClick()}>
            Search
          </Button>
        </div>
      </div>
      <Pagination
        onChange={(_event, value) => router.push(`${pathname}?page=${value}`)}
        count={Math.ceil(totalCount / pageSize)}
        page={parseInt(searchParams.get('page') || '1')}
      />
    </div>
  );
};

export default SearchRecipesForm;