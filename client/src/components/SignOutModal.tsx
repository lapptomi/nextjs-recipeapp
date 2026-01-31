import React from "react";

import { Logout } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  MenuItem,
  Typography,
} from "@mui/material";
import { signOut } from "next-auth/react";

import { ROUTES } from "@/types";

export default function SignOutModal() {
  const [modalOpen, setLogoutModalOpen] = React.useState(false);

  const handleSignOut = () => {
    signOut({
      redirect: true,
      callbackUrl: ROUTES.HOME,
    }).finally(() => setLogoutModalOpen(false));
  };
  return (
    <>
      <Dialog open={modalOpen} onClose={() => setLogoutModalOpen(false)}>
        <Box className="px-4 py-2">
          <DialogTitle>Confirm Sign Out</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to sign out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button size="small" onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleSignOut()}
            >
              Sign Out
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <MenuItem onClick={() => setLogoutModalOpen(true)}>
        <ListItemIcon>
          <Logout color="error" fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Logout</Typography>
      </MenuItem>
    </>
  );
}
