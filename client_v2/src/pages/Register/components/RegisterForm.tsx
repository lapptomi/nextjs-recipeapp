import { Link } from "@tanstack/react-router";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import { APPLICATION_NAME } from "../../../constants";

const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  maxWidth: 400,
});

export default function RegisterForm() {
  return (
    <FormWrapper>
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField margin="normal" required fullWidth label="Email Address" autoFocus />
        <TextField margin="normal" required fullWidth label="Username" />
        <TextField margin="normal" required fullWidth label="Password" type="password" />
        <TextField margin="normal" required fullWidth label="Confirm Password" type="password" />
        <Button color="primary" type="submit" fullWidth variant="contained" sx={{ mt: 1 }}>
          Sign Up
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.primary" sx={{ cursor: "pointer" }}>
          Forgot password?
        </Typography>
        <Link to="/auth/login" style={{ textDecoration: "none" }}>
          <Typography variant="body2" color="text.primary">
            Already have an account? Sign In
          </Typography>
        </Link>
      </Box>

      <Typography variant="body2" color="text.secondary" align="center">
        {`Copyright © ${APPLICATION_NAME} ${new Date().getFullYear()}.`}
      </Typography>
    </FormWrapper>
  );
}
