"use client";

import { useState } from "react";

import { Add, Person, Restaurant, Settings } from "@mui/icons-material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Avatar from "@mui/material/Avatar";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { ROUTES } from "@/types";
import SignOutModal from "./SignOutModal";

import type { Session } from "next-auth";

interface Props {
  user?: Session["user"];
}

export default function NavMobileMenu({ user }: Props) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <IconButton onClick={() => setOpen(true)} aria-label="Open menu">
        <MenuIcon />
      </IconButton>

      <Drawer anchor="right" open={open} onClose={close}>
        <Box sx={{ width: 240 }} className="flex h-full flex-col">
          <Box className="flex items-center justify-between border-b border-gray-200 p-4">
            <Typography variant="subtitle1" fontWeight="bold">
              Menu
            </Typography>
            <IconButton onClick={close} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box className="flex flex-1 flex-col gap-2 p-4">
            {user ? (
              <>
                <Box className="flex items-center gap-2 py-2">
                  <Avatar alt="profile" src={user.image ?? undefined} className="size-8">
                    {user.name ? user.name[0] : ""}
                  </Avatar>
                  <Typography variant="body2">{user.name}</Typography>
                </Box>
                <Divider />
                <MenuItem component={Link} href={ROUTES.GENERATE_RECIPE} onClick={close}>
                  <ListItemIcon>
                    <AutoAwesomeIcon fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Generate Recipe
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} href={ROUTES.RECIPES} onClick={close}>
                  <ListItemIcon>
                    <Restaurant fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Browse Recipes
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} href={ROUTES.CREATE_RECIPE} onClick={close}>
                  <ListItemIcon>
                    <Add fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Create Recipe
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} href={`${ROUTES.PROFILES}/${user.id}`} onClick={close}>
                  <ListItemIcon>
                    <Person fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Profile
                  </Typography>
                </MenuItem>
                <MenuItem
                  component={Link}
                  href={`${ROUTES.PROFILES}/${user.id}/settings`}
                  onClick={close}
                >
                  <ListItemIcon>
                    <Settings fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Settings
                  </Typography>
                </MenuItem>
                <Divider />
                <SignOutModal />
              </>
            ) : (
              <>
                <MenuItem component={Link} href={ROUTES.RECIPES} onClick={close}>
                  <ListItemIcon>
                    <Restaurant fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Browse Recipes
                  </Typography>
                </MenuItem>
                <MenuItem component={Link} href={ROUTES.LOGIN} onClick={close}>
                  <ListItemIcon>
                    <PersonOutlineOutlinedIcon fontSize="medium" />
                  </ListItemIcon>
                  <Typography variant="body1" color="text.secondary">
                    Sign in
                  </Typography>
                </MenuItem>
                <Button
                  fullWidth
                  variant="contained"
                  href={ROUTES.REGISTER}
                  color="primary"
                  onClick={close}
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
