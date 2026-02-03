import { Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Box, Container, Link, Typography } from "@mui/material";

import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#171717" }}>
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
              <Typography variant="h6" className="font-bold" sx={{ color: "common.white" }}>
                {APPLICATION_NAME}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#a1a1a1", lineHeight: 1.6 }}>
              Your go-to platform for discovering, creating, and sharing delicious recipes with a
              passionate community.
            </Typography>
            <Box className="flex items-center gap-3">
              <Box
                component="a"
                href="#"
                className="flex items-center justify-center rounded-lg"
                sx={{
                  bgcolor: "#262626",
                  width: 36,
                  height: 36,
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                <Instagram sx={{ color: "common.white", fontSize: 16 }} />
              </Box>
              <Box
                component="a"
                href="#"
                className="flex items-center justify-center rounded-lg"
                sx={{
                  bgcolor: "#262626",
                  width: 36,
                  height: 36,
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                <Facebook sx={{ color: "common.white", fontSize: 16 }} />
              </Box>
              <Box
                component="a"
                href="#"
                className="flex items-center justify-center rounded-lg"
                sx={{
                  bgcolor: "#262626",
                  width: 36,
                  height: 36,
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "#333" },
                }}
              >
                <LinkedIn sx={{ color: "common.white", fontSize: 16 }} />
              </Box>
            </Box>
          </Box>

          {/* Column 2: Product */}
          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Product
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link
                href={ROUTES.RECIPES}
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Browse Recipes
              </Link>
              <Link
                href={ROUTES.CREATE_RECIPE}
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Create Recipe
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Collections
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Meal Planner
              </Link>
            </Box>
          </Box>

          {/* Column 3: Company */}
          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Company
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                About Us
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Blog
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Careers
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Contact
              </Link>
            </Box>
          </Box>

          {/* Column 4: Resources */}
          <Box className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold" sx={{ color: "common.white" }}>
              Resources
            </Typography>
            <Box className="flex flex-col gap-3">
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Help Center
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Community
              </Link>
              <Link
                href="/privacy"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{
                  color: "#a1a1a1",
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                Terms of Service
              </Link>
            </Box>
          </Box>
        </Box>

        {/* Bottom Section */}
        <Box
          className="flex flex-wrap items-center justify-between gap-4 border-t pt-6"
          sx={{ borderColor: "#262626" }}
        >
          <Typography variant="body2" sx={{ color: "#a1a1a1" }}>
            © {new Date().getFullYear()} {APPLICATION_NAME}. All rights reserved
          </Typography>
          <Box className="flex gap-6">
            <Link
              href="/privacy"
              variant="body2"
              sx={{
                color: "#a1a1a1",
                textDecoration: "none",
                "&:hover": { color: "common.white" },
              }}
            >
              Privacy
            </Link>
            <Link
              href="#"
              variant="body2"
              sx={{
                color: "#a1a1a1",
                textDecoration: "none",
                "&:hover": { color: "common.white" },
              }}
            >
              Terms
            </Link>
            <Link
              href="#"
              variant="body2"
              sx={{
                color: "#a1a1a1",
                textDecoration: "none",
                "&:hover": { color: "common.white" },
              }}
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
