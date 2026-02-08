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

const MenuItemWithIcon = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <Typography variant="body1" color="text.secondary" fontWeight="medium">
        {label}
      </Typography>
    </MenuItem>
  );
};

export default function AccountMenu({ user }: Props) {
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
          <Avatar alt="profile" src={user?.image ?? undefined} className="size-8">
            {user?.name ? user.name[0] : ""}
          </Avatar>
          <Typography variant="body1" color="text.secondary" fontWeight="medium">
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
              onClick={() => handleClose()}
            />
          </Link>

          <Link href={ROUTES.CREATE_RECIPE}>
            <MenuItemWithIcon
              icon={<Add fontSize="medium" />}
              label="Create Recipe"
              onClick={() => handleClose()}
            />
          </Link>

          <Link href={`${ROUTES.PROFILES}/${user.id}/settings`}>
            <MenuItemWithIcon
              icon={<Settings fontSize="medium" color="inherit" />}
              label="Settings"
              onClick={() => handleClose()}
            />
          </Link>

          <Divider />
          <SignOutModal />
        </Box>
      </Menu>
    </>
  );
}
