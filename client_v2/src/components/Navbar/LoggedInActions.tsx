import { Link } from "@tanstack/react-router";
import Add from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Restaurant from "@mui/icons-material/Restaurant";
import { Button, Tooltip, Typography } from "@mui/material";
import AccountMenu from "./AccountMenu";
import type { AuthUser } from "../../types/auth";

interface Props {
  user: AuthUser;
  onLogout: () => void;
}

export default function LoggedInActions({ user, onLogout }: Props) {
  return (
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
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Generate Recipe
          </Typography>
        </Button>
      </Tooltip>

      <Button
        component={Link}
        to="/recipes"
        size="small"
        color="inherit"
        startIcon={<Restaurant color="primary" />}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Browse Recipes
        </Typography>
      </Button>

      <Tooltip title="Create new recipe">
        <Button
          component={Link}
          to="/recipes/create"
          size="small"
          color="inherit"
        >
          <Add color="primary" />
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Create
          </Typography>
        </Button>
      </Tooltip>

      <AccountMenu user={user} onLogout={onLogout} />
    </>
  );
}
