import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Box, Container, Link, Typography } from "@mui/material";

import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";

import FooterLink from "./FooterLink";

export default function Footer() {
  return (
    <Box component="footer" className="bg-[#171717]">
      <Container maxWidth="xl" className="py-16">
        <Box
          className="grid gap-12 pb-16"
          sx={{
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
          }}
        >
          <Box className="flex flex-col gap-4">
            <Box className="flex items-center gap-2">
              <Box
                className="flex items-center justify-center rounded-lg p-1.5"
                sx={{ bgcolor: "primary.main" }}
              >
                <SoupKitchenOutlinedIcon sx={{ color: "primary.contrastText", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" className="font-bold" color="text.primaryLight">
                {APPLICATION_NAME}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondaryLight" lineHeight={1.6}>
              Your go-to platform for discovering, creating, and sharing delicious recipes with a
              passionate community.
            </Typography>
          </Box>

          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Product
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link href={ROUTES.RECIPES} variant="body2" color="text.secondaryLight">
                Browse Recipes
              </Link>
              <Link href={ROUTES.CREATE_RECIPE} variant="body2" color="text.secondaryLight">
                Create Recipe
              </Link>
            </Box>
          </Box>

          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Legal
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link href="/privacy" variant="body2" color="text.secondaryLight">
                Privacy Policy
              </Link>
            </Box>
          </Box>
        </Box>

        <Box className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-700 pt-6">
          <Typography variant="body2" sx={{ color: "#a1a1a1" }}>
            © {new Date().getFullYear()} {APPLICATION_NAME}. All rights reserved
          </Typography>
          <Box className="flex gap-6">
            <FooterLink href="/privacy">Privacy</FooterLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
