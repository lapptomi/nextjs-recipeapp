import { Link } from "@tanstack/react-router";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { APPLICATION_NAME } from "../../../constants";

const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  maxWidth: 400,
});

export default function LoginForm() {
  return (
    <FormWrapper>
      <Typography variant="h5">Sign In</Typography>

      <Box>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Button color="primary" type="submit" fullWidth variant="contained">
            Sign In
          </Button>
          <Button startIcon={<GitHubIcon />} color="secondary" fullWidth variant="outlined">
            Sign In With GitHub
          </Button>
          <Button startIcon={<FcGoogle />} color="secondary" fullWidth variant="outlined">
            Sign In With Google
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            By signing in, you agree to our{" "}
            <Link to="/privacy" style={{ color: "inherit" }}>
              Privacy Policy
            </Link>
            .
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.primary" sx={{ cursor: "pointer" }}>
          Forgot password?
        </Typography>
        <Link to="/auth/register" style={{ textDecoration: "none" }}>
          <Typography variant="body2" color="text.primary">
            Don&apos;t have an account? Sign Up
          </Typography>
        </Link>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        {`Copyright © ${APPLICATION_NAME} ${new Date().getFullYear()}.`}
      </Typography>
    </FormWrapper>
  );
}
