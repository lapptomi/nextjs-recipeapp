/* eslint-disable no-null/no-null */
"use client";

import * as React from 'react';

import { AddBox, Person } from '@mui/icons-material';
import Logout from '@mui/icons-material/Logout';
import { Button, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import type { Session } from 'next-auth';

interface Props {
  user: Session['user'];
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
      <Tooltip title="Account settings">
        <Button style={{ gap: 10 }} color="info" onClick={handleClick} size="small">
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.name ? user.name[0] : ''}
          </Avatar>
          <Typography variant="body2">{user?.name || ''}</Typography>
        </Button>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        disableScrollLock={true}
        onClose={handleClose}      
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href={`/profiles/${user.id}`}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
        </Link>

        <Link href={'/recipes/create'}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AddBox color="primary" fontSize="small" />
            </ListItemIcon>
            Create New Recipe
          </MenuItem>
        </Link>
        
        <Divider />

        <MenuItem
          onClick={() => {
            if (window.confirm('Are you sure you want to sign out?')) {
              signOut({ callbackUrl: '/recipes' });
            }
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;