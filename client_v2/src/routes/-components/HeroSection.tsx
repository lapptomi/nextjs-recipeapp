import { Link } from "@tanstack/react-router";
import { Box, Button, Container, Typography, styled } from "@mui/material";

const HeroContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-evenly",
  gap: theme.spacing(4),
}));

const HeroText = styled(Box)({
  maxWidth: 500,
  display: "flex",
  flexDirection: "column",
  gap: 24,
});

const HeroImageWrapper = styled(Box)(({ theme }) => ({
  height: 560,
  width: 500,
  overflow: "hidden",
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[8],
}));


export default function HeroSection() {
  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <HeroContent>
          <HeroText>
            <Typography
              variant="h2"
              sx={{ fontWeight: "bold" }}
              color="text.primary"
            >
              Discover & share recipes you&apos;ll love
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "normal" }}
              color="text.secondary"
            >
              Join other home cooks sharing their favorite recipes. Browse,
              create, and cook delicious meals every day.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Button
                component={Link}
                to="/recipes"
                variant="contained"
                size="large"
                sx={{ flex: 1, py: 1.5 }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Browse Recipes
                </Typography>
              </Button>
              <Button
                component={Link}
                to="/auth/register"
                color="secondary"
                variant="outlined"
                size="large"
                sx={{ flex: 1, py: 1.5 }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Share Your Recipe
                </Typography>
              </Button>
            </Box>
          </HeroText>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <HeroImageWrapper>
              <img src="/recipeimage.jpeg" alt="Delicious recipe" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </HeroImageWrapper>
          </Box>
        </HeroContent>
      </Container>
    </Box>
  );
}
