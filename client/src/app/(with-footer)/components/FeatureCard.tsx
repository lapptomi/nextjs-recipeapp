import type { ReactNode } from "react";

import { Box, Typography } from "@mui/material";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Box className="flex flex-col items-center text-center" sx={{ maxWidth: 300 }}>
      <Box
        className="mb-4 flex size-16 items-center justify-center rounded-full"
        sx={{ bgcolor: "primary.main" }}
      >
        {icon}
      </Box>
      <Typography variant="h6" className="mb-2 font-bold" sx={{ color: "text.primary" }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {description}
      </Typography>
    </Box>
  );
}
