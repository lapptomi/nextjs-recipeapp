import { Box } from "@mui/material";
import HeroSection from "./-components/HeroSection";
import PopularRecipesSection from "./-components/PopularRecipesSection";
import FeaturesSection from "./-components/FeaturesSection";
import LaptopShowcaseSection from "./-components/LaptopShowcaseSection";
import PricingSection from "./-components/PricingSection";
import CtaSection from "./-components/CtaSection";

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <PopularRecipesSection />
      <LaptopShowcaseSection />
      <PricingSection />
      <FeaturesSection />
      <CtaSection />
    </Box>
  );
}
