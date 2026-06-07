import { Box, Button, Chip, Divider, Typography, styled } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "@tanstack/react-router";

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  popular?: boolean;
}

const Card = styled(Box, {
  shouldForwardProp: (prop) => prop !== "popular",
})<{ popular?: boolean }>(({ popular, theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  borderRadius: "16px",
  border: popular
    ? `2px solid ${theme.palette.primary.main}`
    : "2px solid #e5e7eb",
  flex: 1,
  position: "relative",
  backgroundColor: theme.palette.background.paper,
}));

const FeatureList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}));

export default function PricingCard({
  name,
  description,
  price,
  period,
  features,
  ctaLabel,
  ctaTo,
  popular = false,
}: PricingCardProps) {
  return (
    <Card popular={popular}>
      {popular && (
        <Chip
          label="MOST POPULAR"
          size="small"
          sx={{
            position: "absolute",
            top: -16,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "primary.main",
            color: "white",
            fontWeight: "bold",
            letterSpacing: 1,
            borderRadius: 20,
            px: 1,
          }}
        />
      )}

      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          {name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
        <Typography variant="body1" sx={{ fontWeight: "medium" }}>
          $
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {price}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          / {period}
        </Typography>
      </Box>

      <Button
        component={Link}
        to={ctaTo}
        variant={popular ? "contained" : "outlined"}
        fullWidth
        sx={{
          fontWeight: "bold",
          letterSpacing: 1,
          borderRadius: 2,
          textTransform: "uppercase",
          borderColor: "text.primary",
          color: popular ? "text.primaryLight" : "text.primary",
        }}
      >
        {ctaLabel}
      </Button>

      <Divider />

      <FeatureList>
        {features.map((feature) => (
          <Box
            key={feature}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
          >
            <CheckIcon
              sx={{
                color: "primary.main",
                fontSize: 18,
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {feature}
            </Typography>
          </Box>
        ))}
      </FeatureList>
    </Card>
  );
}
