"use client";

import React from "react";

import { Add, Person, Settings } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";

import { ROUTES } from "@/types";

import SignOutModal from "./SignOutModal";

import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

const AccountMenu: React.FC<Props> = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Account menu">
        <Button onClick={handleClick} size="small" className="flex flex-row gap-2">
          <Avatar alt="profile" src={user?.image || ""} className="size-8">
            {user?.name ? user.name[0] : ""}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            {user?.name || ""}
          </Typography>
        </Button>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        disableScrollLock={true}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box className="flex flex-col gap-1">
          <Link href={`${ROUTES.PROFILES}/${user.id}`}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Person fontSize="small" color="inherit" />
              </ListItemIcon>
              <Typography variant="body2">Profile</Typography>
            </MenuItem>
          </Link>

          <Link href={ROUTES.CREATE_RECIPE}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Add fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Create Recipe</Typography>
            </MenuItem>
          </Link>

          <Link href={`${ROUTES.PROFILES}/${user.id}/settings`}>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings color="inherit" fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
          </Link>

          <Divider />
          <SignOutModal />
        </Box>
      </Menu>
    </>
  );
};

export default AccountMenu;
