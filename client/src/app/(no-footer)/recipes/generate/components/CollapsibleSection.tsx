"use client";

import { useState } from "react";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Typography } from "@mui/material";

interface CollapsibleSectionProps {
  title: string;
  count?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box className="rounded-lg bg-gray-50 p-3">
      <Button
        fullWidth
        color="secondary"
        onClick={() => setOpen(!open)}
        className="!justify-between rounded-xl px-2 py-2 normal-case"
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      >
        <Box className="flex items-center gap-2">
          <Typography variant="caption" fontWeight="bold">
            {title}
          </Typography>
          {count && (
            <Typography variant="caption" color="text.disabled">
              ({count})
            </Typography>
          )}
        </Box>
      </Button>

      {open && children}
    </Box>
  );
}
