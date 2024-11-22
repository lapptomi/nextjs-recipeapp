/* eslint-disable no-null/no-null */
"use client";

import React from "react";

import { AddBox, Person } from "@mui/icons-material";
import Logout from "@mui/icons-material/Logout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import { signOut } from "next-auth/react";

import { PAGES } from "@/types";

import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

const AccountMenu: React.FC<Props> = ({ user }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
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
        <Button
          onClick={handleClick}
          size="small"
          className="flex flex-row gap-2"
        >
          <Avatar className="size-7">{user.name ? user.name[0] : ""}</Avatar>
          <Typography variant="body2">{user?.name || ""}</Typography>
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
        <Link href={`${PAGES.PROFILES}/${user.id}`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Person fontSize="small" color="secondary" />
            </ListItemIcon>
            <Typography variant="body2">Profile</Typography>
          </MenuItem>
        </Link>

        <Link href={PAGES.CREATE_RECIPE}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AddBox color="secondary" fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Create Recipe</Typography>
          </MenuItem>
        </Link>

        <Divider />

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <div className="p-2">
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to sign out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setModalOpen(false);
                  signOut({ callbackUrl: PAGES.RECIPES });
                }}
              >
                Sign Out
              </Button>
            </DialogActions>
          </div>
        </Dialog>

        <MenuItem onClick={() => setModalOpen(true)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
