import { Link } from "@tanstack/react-router";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { Button, Typography } from "@mui/material";

export default function LoggedOutActions() {
  return (
    <>
      <Button
        component={Link}
        to="/auth/login"
        startIcon={<PersonOutlineOutlinedIcon />}
        color="inherit"
        sx={{ color: "text.secondary" }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Sign in
        </Typography>
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
  );
}
