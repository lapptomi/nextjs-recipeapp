import { useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Typography } from "@mui/material";

interface Props {
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
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Box sx={{ borderRadius: 2, bgcolor: "grey.50", p: 1.5 }}>
      <Button
        fullWidth
        color="secondary"
        onClick={() => setOpen(!open)}
        endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{ justifyContent: "space-between", textTransform: "none", px: 1 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: "bold" }}>
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
