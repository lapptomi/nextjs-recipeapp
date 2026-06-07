import { Box, Container, Typography } from "@mui/material";
import PricingCard from "./PricingCard";

interface Plan {
  name: string;
  description: string;
  price: number;
  period: string;
  ctaLabel: string;
  ctaTo: string;
  popular: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    name: "Free",
    description: "For casual cooks getting started.",
    price: 0,
    period: "forever",
    ctaLabel: "Get Started",
    ctaTo: "/auth/register",
    popular: false,
    features: [
      "Browse all 500+ recipes",
      "5 AI-generated recipes / month",
      "Save up to 10 favorites",
      "Basic search & filters",
    ],
  },
  {
    name: "Pro",
    description: "For home cooks who use AI every day.",
    price: 4.95,
    period: "per month",
    ctaLabel: "Start Free Trial",
    ctaTo: "/auth/register",
    popular: true,
    features: [
      "Unlimited AI recipe generation",
      "One-tap recipe tweaks",
      "Weekly meal planning",
      "Auto shopping lists",
      "Unlimited saved recipes",
    ],
  },
  {
    name: "Family",
    description: "For households cooking together.",
    price: 10,
    period: "per month",
    ctaLabel: "Start Free Trial",
    ctaTo: "/auth/register",
    popular: false,
    features: [
      "Everything in Pro",
      "Up to 6 family members",
      "Shared meal plans & lists",
      "Dietary profiles per person",
      "Priority AI generation",
    ],
  },
];

export default function PricingSection() {
  return (
    <Box sx={{ py: 10, bgcolor: "grey.50" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="body1"
            sx={{ color: "primary.main", fontWeight: "bold", letterSpacing: 2 }}
          >
            PRICING
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mt: 1, mb: 2, color: "text.primary" }}
          >
            Start free. Upgrade when you're cooking more.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", maxWidth: 480, mx: "auto" }}
          >
            No credit card to start. Cancel anytime. Every paid plan includes a
            14-day free trial.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "stretch",
            mt: 4,
          }}
        >
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} {...plan} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
