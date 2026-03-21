import Add from "@mui/icons-material/Add";
import Restaurant from "@mui/icons-material/Restaurant";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { getSession } from "@/lib/actions/auth";
import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountMenu from "./AccountMenu";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NavMobileMenu from "./NavMobileMenu";

export default async function Navigation() {
  const session = await getSession();

  return (
    <Box className="flex w-full flex-row justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-8">
      <Link href={ROUTES.HOME} className="flex items-center justify-center">
        <Box className="flex items-center gap-2">
          <Box className="flex items-center justify-center rounded-lg p-1 bg-orange-400 hover:bg-orange-500">
            <SoupKitchenOutlinedIcon color="info" sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.primary"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {APPLICATION_NAME}
          </Typography>
        </Box>
      </Link>

      {/* Desktop nav */}
      <Box className="hidden md:flex flex-row items-center gap-2">
        {session && session.user ? (
          <Box className="flex flex-row items-center gap-1">
            <Tooltip title="Generate recipes easily with AI">
              <Button
                startIcon={<AutoAwesomeIcon />}
                size="small"
                href={ROUTES.GENERATE_RECIPE}
                color="primary"
                variant="outlined"
              >
                <Typography variant="body2" color="text.secondary">
                  Generate Recipe
                </Typography>
              </Button>
            </Tooltip>

            <Button size="small" href={ROUTES.RECIPES} startIcon={<Restaurant color="primary" />}>
              <Typography variant="body2" color="text.secondary">
                Browse Recipes
              </Typography>
            </Button>

            <Tooltip title="Create new recipe">
              <Button size="small" href={ROUTES.CREATE_RECIPE}>
                <Add color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Create
                </Typography>
              </Button>
            </Tooltip>

            <AccountMenu user={session.user} />
          </Box>
        ) : (
          <>
            <Button
              sx={{ color: "text.secondary" }}
              href={ROUTES.LOGIN}
              startIcon={<PersonOutlineOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary">
                Sign in
              </Typography>
            </Button>
            <Button size="small" variant="contained" href={ROUTES.REGISTER} color="primary">
              <Typography variant="body2" color="text.primaryLight">
                Sign up
              </Typography>
            </Button>
          </>
        )}
      </Box>

      {/* Mobile nav */}
      <Box className="flex md:hidden items-center">
        <NavMobileMenu user={session?.user} />
      </Box>
    </Box>
  );
}
