import { Link } from "@tanstack/react-router";
import Add from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Restaurant from "@mui/icons-material/Restaurant";
import SoupKitchenOutlinedIcon from "@mui/icons-material/SoupKitchenOutlined";
import { Avatar, Box, Button, Tooltip, Typography } from "@mui/material";
import { APPLICATION_NAME } from "../constants";

const isLoggedIn = false;

export default function Navbar() {
  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        bgcolor: "background.paper",
        px: 4,
        py: 1.5,
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
              p: 0.75,
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <SoupKitchenOutlinedIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }} color="text.primary">
            {APPLICATION_NAME}
          </Typography>
        </Box>
      </Link>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isLoggedIn ? (
          <>
            <Tooltip title="Generate recipes easily with AI">
              <Button
                component={Link}
                to="/recipes/generate"
                startIcon={<AutoAwesomeIcon />}
                size="small"
                color="primary"
                variant="outlined"
              >
                <Typography variant="body2" color="text.secondary">Generate Recipe</Typography>
              </Button>
            </Tooltip>

            <Button
              component={Link}
              to="/recipes"
              size="small"
              startIcon={<Restaurant color="primary" />}
            >
              <Typography variant="body2" color="text.secondary">Browse Recipes</Typography>
            </Button>

            <Tooltip title="Create new recipe">
              <Button component={Link} to="/recipes/create" size="small">
                <Add color="primary" />
                <Typography variant="body2" color="text.secondary">Create</Typography>
              </Button>
            </Tooltip>

            <Avatar sx={{ width: 32, height: 32, cursor: "pointer", ml: 1 }} />
          </>
        ) : (
          <>
            <Button
              component={Link}
              to="/auth/login"
              startIcon={<PersonOutlineOutlinedIcon />}
              sx={{ color: "text.secondary" }}
            >
              <Typography variant="body2" color="text.secondary">Sign in</Typography>
            </Button>
            <Button
              component={Link}
              to="/auth/register"
              size="small"
              variant="contained"
              color="primary"
            >
              <Typography variant="body2">Sign up</Typography>
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
