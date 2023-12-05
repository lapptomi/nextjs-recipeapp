"use client";

import React, { useState } from "react";

import { SearchOutlined } from "@mui/icons-material";
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from '@/styles/SearchRecipesForm.module.css';

interface Props {
  totalCount: number;
}

const SearchRecipesForm: React.FC<Props> = ({ totalCount }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchField, setSearchField] = useState('');
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc'>('date_desc');


  const handleSubmit = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set("sortby", sortBy);
    current.set("title", searchField);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <div className={styles.main}>
      <form className={styles.filterform} onSubmit={handleSubmit}>
        
        <FormControl variant="standard" style={{ minWidth: 120 }}>
          <InputLabel size="small">Sort By</InputLabel>
          <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as any)}>
            <MenuItem  value={'date_asc'}>
              Oldest
            </MenuItem>
            <MenuItem value={'date_desc'}>
              Newest
            </MenuItem>
          </Select>
        </FormControl>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Search"
            placeholder='Enter recipe name...'
            size="small"
            onChange={(event) => setSearchField(event.target.value)}
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
        onChange={(_event, value) => router.push(`${pathname}?page=${value}`)}
        count={Math.ceil(totalCount / parseInt(searchParams.get('pageSize') || '9'))}
        page={parseInt(searchParams.get('page') || '1')}
      />
    </div>
  );
};

export default SearchRecipesForm;