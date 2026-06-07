"use client";

import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";

interface ShoppingListQRModalProps {
  recipeId: number;
}

export default function ShoppingListQRModal({ recipeId }: ShoppingListQRModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/recipes/${recipeId}/ingredients`
      : `/recipes/${recipeId}/ingredients`;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  }

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<QrCodeIcon fontSize="small" />}
        onClick={() => setOpen(true)}
        color="default"
      >
        Shopping List
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle className="flex items-center justify-between">
          <Typography variant="h5" fontWeight="bold">
            Shopping List QR Code
          </Typography>
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="flex flex-col items-center gap-5 pb-6">
          <Typography variant="body1" color="text.secondary">
            Scan this QR code with your phone to access a mobile-friendly shopping list for this
            recipe.
          </Typography>

          <Box className="rounded-xl border border-gray-200 p-4">
            <QRCodeSVG value={url} size={200} />
          </Box>

          <Box className="w-full">
            <Typography variant="body2" color="text.secondary" className="mb-2 text-center">
              Or copy the link:
            </Typography>
            <Box className="flex items-center gap-2">
              <OutlinedInput fullWidth readOnly value={url} size="small" />
              <Button variant="outlined" color="default" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartIcon fontSize="small" />}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="!normal-case"
          >
            Open Shopping List
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
