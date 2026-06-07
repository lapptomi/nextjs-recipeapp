import type { ReactNode } from "react";

import { Typography } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";

interface MenuItemWithIconProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

export default function MenuItemWithIcon({ icon, label, onClick }: MenuItemWithIconProps) {
  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </MenuItem>
  );
}
