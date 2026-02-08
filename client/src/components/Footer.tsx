import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Box, Container, Link, Typography } from "@mui/material";

import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} variant="body2" color="text.secondaryLight">
      {children}
    </Link>
  );
};

export default function Footer() {
  return (
    <Box component="footer" className="bg-[#171717]">
      <Container maxWidth="xl" className="py-16">
        <Box
          className="grid gap-12 pb-16"
          sx={{
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
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
            <Box className="flex items-center gap-3">
              <Box
                component="a"
                href="#"
                className="flex items-center justify-center rounded-lg size-9 bg-zinc-700 transition-colors duration-200 hover:bg-zinc-800"
              >
                <Instagram sx={{ color: "common.white", fontSize: 16 }} />
              </Box>
              <Box
                component="a"
                href="#"
                className="flex items-center justify-center rounded-lg size-9 bg-zinc-700 transition-colors duration-200 hover:bg-zinc-800"
              >
                <Facebook sx={{ color: "common.white", fontSize: 16 }} />
              </Box>
              <Box
                component="a"
                href="#"
                className="flex items-center justify-center rounded-lg size-9 bg-zinc-700 transition-colors duration-200 hover:bg-zinc-800"
              >
                <LinkedIn sx={{ color: "common.white", fontSize: 16 }} />
              </Box>
            </Box>
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
              <Link href="#" variant="body2" color="text.secondaryLight">
                Collections
              </Link>
              <Link href="#" variant="body2" color="text.secondaryLight">
                Meal Planner
              </Link>
            </Box>
          </Box>

          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Company
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link href="#" variant="body2" color="text.secondaryLight">
                About Us
              </Link>
              <Link href="#" variant="body2" color="text.secondaryLight">
                Blog
              </Link>
              <Link href="#" variant="body2" color="text.secondaryLight">
                Careers
              </Link>
              <Link href="#" variant="body2" color="text.secondaryLight">
                Contact
              </Link>
            </Box>
          </Box>

          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Resources
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link href="#" variant="body2" color="text.secondaryLight">
                Help Center
              </Link>
              <Link href="#" variant="body2" color="text.secondaryLight">
                Community
              </Link>
              <Link href="/privacy" variant="body2" color="text.secondaryLight">
                Privacy Policy
              </Link>
              <Link href="#" variant="body2" color="text.secondaryLight">
                Terms of Service
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box className="flex flex-wrap items-center justify-between gap-4 border-t pt-6 border-zinc-700">
          <Typography variant="body2" sx={{ color: "#a1a1a1" }}>
            © {new Date().getFullYear()} {APPLICATION_NAME}. All rights reserved
          </Typography>
          <Box className="flex gap-6">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
            <FooterLink href="#">Cookies</FooterLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
