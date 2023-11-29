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
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc'>('date_asc');


  const handleSubmit = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    current.set("sort", sortBy);
    current.set("title", searchField);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <div className={styles.main}>
      <form className={styles.filterform} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>

          <FormControl variant="standard" style={{ minWidth: 120 }}>
            <InputLabel size="small">Sort By</InputLabel>
            <Select value={sortBy} onChange={(event) => setSortBy(event.target.value as any)}>
              <MenuItem  value={'date_asc'}>
                Date Newest
              </MenuItem>
              <MenuItem value={'date_desc'}>
                Date Oldest
              </MenuItem>
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
            onChange={(event) => setSearchField(event.target.value)}
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
          <Button variant="contained" onClick={handleSubmit}>
            Search
          </Button>
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