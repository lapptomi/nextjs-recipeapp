"use client";

import type { ChangeEvent } from "react";
import React from "react";

import { SearchOutlined } from "@mui/icons-material";
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from '@/styles/SearchRecipesForm.module.css';

interface Props {
  handleSubmit?: any;
}

const SearchRecipesForm: React.FC<Props> = ({ handleSubmit }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (event: ChangeEvent<HTMLSelectElement>) => {
    // now you got a read/write object
    const current = new URLSearchParams(Array.from(searchParams.entries())); // -> has to use this form
    
    // update as necessary
    const value = event.target.value.trim();

    if (!value) {
      current.delete("selected");
    } else {
      current.set("selected", event.target.value);
    }

    // cast to string
    const search = current.toString();
    // or const query = `${'?'.repeat(search.length && 1)}${search}`;
    const query = search ? `?${search}` : "?asd";
    console.log('query', query);

    router.push(`${pathname}${query}`);

    handleSubmit(query);
  };

  return (
    <div className={styles.main}>
      <div className={styles.filterform}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>

          <FormControl variant="standard" style={{ minWidth: 120 }}>
            <InputLabel size="small">Sort By</InputLabel>
            <Select value={10}>
              <MenuItem value={10}>date newest</MenuItem>
              <MenuItem value={20}>date Oldest</MenuItem>
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
          <Button onClick={() => console.log('search')}>
            Clear
          </Button>
          <Button variant="contained" onClick={() => handleClick}>
          Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchRecipesForm;