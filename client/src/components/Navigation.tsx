import { Add } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import Link from "next/link";

import { getSession } from "@/lib/actions/auth";
import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";

import AccountMenu from "./AccountMenu";

const Navigation = async () => {
  const session = await getSession();

  return (
    <Box className="flex w-full flex-row justify-between border-b border-gray-200 bg-white px-8 py-2">
      <Box className="flex flex-row items-center gap-2">
        <Link href={ROUTES.HOME}>
          <Typography variant="body1" fontWeight="">
            {APPLICATION_NAME}
          </Typography>
        </Link>

        <Tooltip title="Home page">
          <Button variant="text" size="small" href={ROUTES.HOME}>
            <Typography variant="overline" fontWeight="medium">
              Home
            </Typography>
          </Button>
        </Tooltip>

        <Tooltip title="Browse recipes">
          <Button variant="text" size="small" href={ROUTES.RECIPES}>
            <Typography variant="overline" fontWeight="medium">
              Recipes
            </Typography>
          </Button>
        </Tooltip>
      </Box>

      <Box className="flex flex-row items-center gap-2">
        {session && session.user ? (
          <>
            <Tooltip title="Create new recipe">
              <Button size="small" href={ROUTES.CREATE_RECIPE}>
                <Add color="primary" />
                <Typography variant="overline">Create</Typography>
              </Button>
            </Tooltip>

            <AccountMenu user={session.user} />
          </>
        ) : (
          <>
            <Button size="small" href={ROUTES.LOGIN}>
              Sign in
            </Button>
            <Button size="small" variant="contained" href={ROUTES.REGISTER}>
              Sign up
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navigation;
