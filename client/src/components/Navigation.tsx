import { Add } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import { getSession } from "@/lib/actions/auth";
import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountMenu from "./AccountMenu";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
const Navigation = async () => {
  const session = await getSession();

  return (
    <Box className="flex w-full flex-row justify-between border-b border-gray-200 bg-white px-8 py-3">
      <Link href={ROUTES.HOME} className="flex items-center justify-center">
        <Box className="flex items-center gap-2">
          <Box className="flex items-center justify-center rounded-lg p-1 bg-orange-400 hover:bg-orange-500">
            <SoupKitchenOutlinedIcon color="info" sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            {APPLICATION_NAME}
          </Typography>
        </Box>
      </Link>

      <Box className="flex flex-row items-center gap-2">
        {session && session.user ? (
          <>
            <Tooltip title="Create new recipe">
              <Button size="small" href={ROUTES.CREATE_RECIPE}>
                <Add color="primary" />
                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                  Create
                </Typography>
              </Button>
            </Tooltip>

            <AccountMenu user={session.user} />
          </>
        ) : (
          <>
            <Button
              sx={{ color: "text.secondary" }}
              href={ROUTES.LOGIN}
              startIcon={<PersonOutlineOutlinedIcon />}
            >
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                Sign in
              </Typography>
            </Button>
            <Button size="small" variant="contained" href={ROUTES.REGISTER} color="primary">
              <Typography variant="body2" color="text.primaryLight" fontWeight="medium">
                Sign up
              </Typography>
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Navigation;
