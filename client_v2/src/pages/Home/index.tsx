import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection";
import PopularRecipesSection from "./components/PopularRecipesSection";
import FeaturesSection from "./components/FeaturesSection";
import CtaSection from "./components/CtaSection";

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <PopularRecipesSection />
      <FeaturesSection />
      <CtaSection />
    </Box>
  );
}
