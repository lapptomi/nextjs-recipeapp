import { Box, Container, Typography, Button, styled } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { theme } from "../../theme";
import LaptopMockup from "../../components/LaptopMockup";

const SectionWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  paddingLeft: theme.spacing(8),
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
});

const ContentRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(4),
});

const TextColumn = styled(Box)({
  maxWidth: "36%",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
});

export default function LaptopShowcaseSection() {
  return (
    <SectionWrapper>
      <Container maxWidth="xl">
        <ContentRow>
          <TextColumn>
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              Easy recipe generation with the{" "}
              <span
                style={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                }}
              >
                AI assistant
              </span>
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "normal", color: "text.secondary" }}
            >
              No more searching for recipes or ingredients. Just tell the AI
              assistant through the chat what you want to eat and it will
              generate a recipe for you.
            </Typography>
            <Button
              component={Link}
              to="/recipes"
              variant="contained"
              size="large"
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Explore Recipes
            </Button>
          </TextColumn>

          <LaptopMockup screenSrc="/generator-img.png" />
        </ContentRow>
      </Container>
    </SectionWrapper>
  );
}
