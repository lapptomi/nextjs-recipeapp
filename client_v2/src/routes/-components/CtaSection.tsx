import { Link } from "@tanstack/react-router";
import { Box, Button, Container, Typography, styled } from "@mui/material";
import { APPLICATION_NAME } from "../../constants";

const CtaGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  gap: theme.spacing(6),
}));

const CtaImageWrapper = styled(Box)(({ theme }) => ({
  height: 500,
  width: 400,
  overflow: "hidden",
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[12],
}));

export default function CtaSection() {
  return (
    <Box sx={{ py: 6, bgcolor: "grey.50" }}>
      <Container maxWidth="xl">
        <CtaGrid>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CtaImageWrapper>
              <img
                src="/recipeimage2.jpg"
                alt="Kitchen setup"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </CtaImageWrapper>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              Start your culinary journey today
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "normal", color: "text.secondary" }}
            >
              Sign up for a seasoned Chef {APPLICATION_NAME}, have you discover
              new flavors, master techniques, and share your passion with a
              community that cares.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                component={Link}
                to="/auth/register"
                variant="contained"
                size="large"
                sx={{ p: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Sign Up To Create Your Free Recipe
                </Typography>
              </Button>
              <Button
                component={Link}
                to="/recipes"
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ p: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Browse Recipes
                </Typography>
              </Button>
            </Box>
          </Box>
        </CtaGrid>
      </Container>
    </Box>
  );
}
