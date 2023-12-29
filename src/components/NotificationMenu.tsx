/* eslint-disable no-null/no-null */
"use client";

import React from 'react';

import { Notifications } from '@mui/icons-material';
import { Avatar, Badge, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';

import type { Session } from 'next-auth';

interface Props {
  user?: Session['user'];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const NotificationMenu = (user: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const users = [
    {
      username: 'Recipe User',
      notification: 'commented your recipe "recipe title"',
    },
    {
      username: 'Random User',
      notification: 'rated your recipe 5 stars!',
    },
    {
      username: 'Test Name',
      notification: 'added you as friend',
    },
  ];

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="info" onClick={handleClick}>
          <Badge badgeContent={3} color="primary">
            <Notifications />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        disableScrollLock={true}
        onClose={handleClose}      
        transformOrigin={{ horizontal: 'center', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <List sx={{ width: '100%', maxWidth: 320 }}>
          {users.map((user, index) => (
            <div key={index}>
              <ListItem key={user.username} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {user.username}
                      </Typography>
                      {` — ${user.notification}`}
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </div>
          ))}
        </List>
        
        <Button fullWidth>
          <Typography variant="caption" color="secondary">
            View more
          </Typography>
        </Button>
      </Menu>
    </>
  );
};

export default NotificationMenu;