import { Link } from "@tanstack/react-router";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Box, Typography, styled } from "@mui/material";
import { APPLICATION_NAME } from "../../constants";
import LoggedInActions from "./LoggedInActions";
import LoggedOutActions from "./LoggedOutActions";
import { useAuth } from "../../contexts/AuthContext";
import { useLogout } from "../../hooks/useLogout";

const NavContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid",
  borderColor: theme.palette.grey[200],
  backgroundColor: theme.palette.background.paper,
  padding: `${theme.spacing(1.5)} ${theme.spacing(4)}`,
}));

const LogoIconWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(0.75),
  backgroundColor: theme.palette.primary.main,
  "&:hover": { backgroundColor: theme.palette.primary.dark },
}));

const NavActions = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export default function Navbar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <NavContainer>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LogoIconWrapper>
            <SoupKitchenOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
          </LogoIconWrapper>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}
            color="text.primary"
          >
            {APPLICATION_NAME}
          </Typography>
        </Box>
      </Link>

      <NavActions>
        {user ? (
          <LoggedInActions user={user} onLogout={logout} />
        ) : (
          <LoggedOutActions />
        )}
      </NavActions>
    </NavContainer>
  );
}
