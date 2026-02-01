"use client";

import React from "react";

import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { signOut } from "next-auth/react";

import { deleteUser } from "@/lib/actions/user";
import { ROUTES } from "@/types";

export default function DeleteAccountModal() {
  const [loading, setLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleDeleteAccount = () => {
    setLoading(true);

    deleteUser().finally(() => {
      setLoading(false);
      setModalOpen(false);
      signOut({
        redirect: true,
        callbackUrl: ROUTES.HOME,
      });
    });
  };

  return (
    <>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box className="px-4 py-2">
          <DialogTitle>Confirm Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete your account?</DialogContentText>
            <DialogContentText>
              This action will permanently delete your account and all associated data.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button size="small" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>

            <Button
              loading={loading}
              disabled={loading}
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDeleteAccount()}
            >
              Delete Account
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Button
        variant="outlined"
        size="small"
        startIcon={<Delete />}
        onClick={() => setModalOpen(true)}
      >
        Delete Account
      </Button>
    </>
  );
}
