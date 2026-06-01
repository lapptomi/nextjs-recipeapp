import { Link } from "@tanstack/react-router";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Box, Button, styled, TextField, Typography } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { APPLICATION_NAME } from "../../../../constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useLogin } from "../../../../hooks/useLogin";
import type { LoginCredentials } from "../../../../types/auth";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const FormWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  width: "100%",
  maxWidth: 400,
});

const ButtonsColumn = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

export default function LoginForm() {
  const login = useLogin();

  const { register, handleSubmit, formState } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginCredentials) => {
    login.mutate(data);
  };

  return (
    <FormWrapper component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5">Sign In</Typography>

      <Box>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoFocus
          {...register("email")}
          error={!!formState.errors.email}
          helperText={formState.errors.email?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register("password")}
          error={!!formState.errors.password}
          helperText={formState.errors.password?.message}
        />
        <ButtonsColumn>
          <Button
            color="primary"
            type="submit"
            fullWidth
            variant="contained"
            disabled={login.isPending}
          >
            {login.isPending ? "Signing in..." : "Sign In"}
          </Button>
          <Button
            startIcon={<GitHubIcon />}
            color="secondary"
            fullWidth
            variant="outlined"
          >
            Sign In With GitHub
          </Button>
          <Button
            startIcon={<FcGoogle />}
            color="secondary"
            fullWidth
            variant="outlined"
          >
            Sign In With Google
          </Button>
          {login.isError && (
            <Typography variant="body2" color="error" align="center">
              {login.error.message}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" align="center">
            By signing in, you agree to our{" "}
            <Link to="/privacy" style={{ color: "inherit" }}>
              Privacy Policy
            </Link>
            .
          </Typography>
        </ButtonsColumn>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ cursor: "pointer" }}
        >
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
