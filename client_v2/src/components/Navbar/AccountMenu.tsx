import React from "react";
import { Link } from "@tanstack/react-router";
import Add from "@mui/icons-material/Add";
import Person from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import type { AuthUser } from "../../types/auth";

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

export default function AccountMenu({ user, onLogout }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleLogout() {
    handleClose();
    onLogout();
  }

  return (
    <>
      <Tooltip title="Account menu">
        <Button
          onClick={handleClick}
          size="small"
          color="inherit"
          sx={{ gap: 1 }}
        >
          <Avatar src={user.image ?? undefined} sx={{ width: 32, height: 32 }}>
            {user.username[0].toUpperCase()}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {user.username}
          </Typography>
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        disableScrollLock
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <MenuItem
            component={Link}
            to={`/users/${user.id}`}
            onClick={handleClose}
          >
            <Person fontSize="small" sx={{ mr: 1 }} />
            Profile
          </MenuItem>

          <MenuItem component={Link} to="/recipes/create" onClick={handleClose}>
            <Add fontSize="small" sx={{ mr: 1 }} />
            Create Recipe
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <Logout fontSize="small" sx={{ mr: 1 }} />
            Sign out
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}
