"use client";

import React, { useCallback, useState } from "react";

import { SearchOutlined } from "@mui/icons-material";
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from '@/styles/SearchRecipesForm.module.css';

interface Props {
  totalCount: number;
}

const createQuery = (params: URLSearchParams) => {
  const search = params.toString();
  return search ? `?${search}` : "";
};

const SearchRecipesForm = ({ totalCount }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageSize = Math.ceil(totalCount / 12);

  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc'>('date_desc');
  const [searchField, setSearchField] = useState('');

  // TODO: refactor pagination and search form
  const handleSubmit = useCallback(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('title', searchField);
    current.set('sortby', sortBy);
    current.set('page', "1");

    router.push(`${pathname}${createQuery(current)}`);
  }, [searchParams, searchField, sortBy, router, pathname]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    event.preventDefault();
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set('page', String(value));
    router.push(`${pathname}${createQuery(current)}`);
  },  [searchParams, router, pathname]);

  return (
    <div className={styles.main}>
      <form className={styles.filterform}>
        <FormControl variant="standard">
          <InputLabel size="small">Sort By</InputLabel>
          <Select
            name="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as any)}
          >
            <MenuItem  value={'date_asc'}>
              Oldest
            </MenuItem>
            <MenuItem value={'date_desc'}>
              Newest
            </MenuItem>
          </Select>
        </FormControl>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <TextField
            label="Search"
            onChange={(event) => setSearchField(event.target.value)}
            placeholder='Enter recipe name...'
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
            <Button onClick={() => router.replace('/recipes')}>
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
        count={pageSize}
        page={parseInt(searchParams.get('page') || '1')}
      />
    </div>
  );
};

export default SearchRecipesForm;