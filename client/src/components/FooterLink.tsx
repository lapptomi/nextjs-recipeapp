import type { ReactNode } from "react";

import { Link } from "@mui/material";

interface FooterLinkProps {
  href: string;
  children: ReactNode;
}

export default function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link href={href} variant="body2" color="text.secondaryLight">
      {children}
    </Link>
  );
}
