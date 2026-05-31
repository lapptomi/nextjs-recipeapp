import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Typography } from "@mui/material";

interface FooterLinkProps {
  to: string;
  children: ReactNode;
}

export default function FooterLink({ to, children }: FooterLinkProps) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Typography variant="body2" sx={{ color: "text.secondaryLight" }}>
        {children}
      </Typography>
    </Link>
  );
}
