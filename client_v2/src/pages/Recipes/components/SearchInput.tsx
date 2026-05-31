import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  title?: string;
}

export default function SearchInput({ title = "" }: Props) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(title);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({
        from: "/recipes/",
        to: "/recipes/",
        search: (prev) => ({ ...prev, title: searchQuery || undefined }),
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, navigate]);

  return (
    <TextField
      placeholder="Search recipes by name, ingredient, or author..."
      variant="outlined"
      fullWidth
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{ bgcolor: "background.paper" }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery("")}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
