import GroupsIcon from "@mui/icons-material/Groups";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Container, Typography, styled } from "@mui/material";
import FeatureCard from "./FeatureCard";

const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: theme.spacing(4),
  justifyItems: "center",
}));

export default function FeaturesSection() {
  return (
    <Box sx={{ bgcolor: "background.paper", py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }} color="text.primary">
            Everything you need to cook better
          </Typography>
          <Typography variant="body1" color="text.secondary">
            All the tools and community support to become a better home cook
          </Typography>
        </Box>
        <FeaturesGrid>
          <FeatureCard
            icon={<SearchIcon sx={{ color: "info.main", fontSize: 32 }} />}
            title="Smart Search"
            description="Find exactly what you're craving with advanced filters and categories"
          />
          <FeatureCard
            icon={<RestaurantMenuIcon sx={{ color: "info.main", fontSize: 32 }} />}
            title="Easy Creation"
            description="Share your recipes in minutes with our intuitive recipe builder"
          />
          <FeatureCard
            icon={<GroupsIcon sx={{ color: "info.main", fontSize: 32 }} />}
            title="Active Community"
            description="Get inspired, tips, and inspiration from fellow food enthusiasts"
          />
        </FeaturesGrid>
      </Container>
    </Box>
  );
}
