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
        <Box className="px-10 py-4">
          <DialogTitle>Confirm Sign Out</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to sign out?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" size="small" onClick={() => setLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" size="small" onClick={() => handleSignOut()}>
              Sign Out
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <MenuItem onClick={() => setLogoutModalOpen(true)}>
        <ListItemIcon>
          <Logout color="error" fontSize="medium" />
        </ListItemIcon>
        <Typography variant="body1" color="text.secondary" fontWeight="medium">
          Logout
        </Typography>
      </MenuItem>
    </>
  );
}
