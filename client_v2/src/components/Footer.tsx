import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Box, Container, Typography } from "@mui/material";
import { APPLICATION_NAME } from "../constants";
import FooterLink from "./FooterLink";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#171717" }}>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 6,
            pb: 6,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  p: 0.75,
                  bgcolor: "primary.main",
                }}
              >
                <SoupKitchenOutlinedIcon sx={{ color: "primary.contrastText", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primaryLight" }}>
                {APPLICATION_NAME}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "text.secondaryLight", lineHeight: 1.6 }}>
              Your go-to platform for discovering, creating, and sharing delicious recipes with a
              passionate community.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primaryLight" }}>
              Product
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FooterLink to="/recipes">Browse Recipes</FooterLink>
              <FooterLink to="/recipes/create">Create Recipe</FooterLink>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primaryLight" }}>
              Legal
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderTop: "1px solid",
            borderColor: "#3f3f46",
            pt: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondaryLight" }}>
            © {new Date().getFullYear()} {APPLICATION_NAME}. All rights reserved
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <FooterLink to="/privacy">Privacy</FooterLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
