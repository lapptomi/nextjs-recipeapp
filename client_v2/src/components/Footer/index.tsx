import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Box, Container, Typography, styled } from "@mui/material";
import { APPLICATION_NAME } from "../../constants";
import FooterLink from "./FooterLink";

const FooterGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const FooterBottom = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  borderTop: "1px solid #3f3f46",
  paddingTop: 24,
});

const LogoIconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.75),
  backgroundColor: theme.palette.primary.main,
}));

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: "#171717" }}>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <FooterGrid>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LogoIconWrapper>
                <SoupKitchenOutlinedIcon
                  sx={{ color: "primary.contrastText", fontSize: 20 }}
                />
              </LogoIconWrapper>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "text.primaryLight" }}
              >
                {APPLICATION_NAME}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondaryLight", lineHeight: 1.6 }}
            >
              Your go-to platform for discovering, creating, and sharing
              delicious recipes with a passionate community.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primaryLight" }}
            >
              Product
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FooterLink to="/recipes">Browse Recipes</FooterLink>
              <FooterLink to="/recipes/create">Create Recipe</FooterLink>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primaryLight" }}
            >
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
            </Box>
          </Box>
        </FooterGrid>

        <FooterBottom>
          <Typography variant="body2" sx={{ color: "text.secondaryLight" }}>
            © {new Date().getFullYear()} {APPLICATION_NAME}. All rights reserved
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <FooterLink to="/privacy">Privacy</FooterLink>
          </Box>
        </FooterBottom>
      </Container>
    </Box>
  );
}
