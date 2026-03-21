"use client";

import React from "react";

import Add from "@mui/icons-material/Add";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import { Box, Button, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";

import { ROUTES } from "@/types";

import MenuItemWithIcon from "./MenuItemWithIcon";
import SignOutModal from "./SignOutModal";

import type { Session } from "next-auth";

interface Props {
  user: Session["user"];
}

export default function AccountMenu({ user }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title="Account menu">
        <Button onClick={handleClick} size="small" className="flex flex-row gap-2">
          <Avatar alt="profile" src={user?.image ?? undefined} className="size-8">
            {user?.name ? user.name[0] : ""}
          </Avatar>
          <Typography variant="body1" color="text.secondary">
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
            <MenuItemWithIcon
              icon={<Person fontSize="medium" color="inherit" />}
              label="Profile"
              onClick={handleClose}
            />
          </Link>

          <Link href={ROUTES.CREATE_RECIPE}>
            <MenuItemWithIcon
              icon={<Add fontSize="medium" />}
              label="Create Recipe"
              onClick={handleClose}
            />
          </Link>

          <Link href={`${ROUTES.PROFILES}/${user.id}/settings`}>
            <MenuItemWithIcon
              icon={<Settings fontSize="medium" color="inherit" />}
              label="Settings"
              onClick={handleClose}
            />
          </Link>

          <Divider />
          <SignOutModal />
        </Box>
      </Menu>
    </>
  );
}
