import type { ReactNode } from "react";
import { Box, Typography, styled } from "@mui/material";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const CardWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  maxWidth: 300,
});

const IconWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: "flex",
  width: 64,
  height: 64,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
}));

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <CardWrapper>
      <IconWrapper>{icon}</IconWrapper>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }} color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardWrapper>
  );
}
