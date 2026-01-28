"use client";

import React, { useState } from "react";

import GitHubIcon from "@mui/icons-material/GitHub";
import {
  Alert,
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";

import { APPLICATION_NAME } from "@/lib/constants";
import { ROUTES } from "@/types";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        if (res?.error) {
          throw new Error(res.error);
        } else {
          window.location.replace(ROUTES.RECIPES);
        }
      })
      .catch(() => {
        setError("Invalid or missing credentials");
      });
  };

  const handleGitHubSignIn = async () => {
    signIn("github").catch((error) => setError(error.message));
  };

  return (
    <Box className="signform">
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="h5">Sign In</Typography>
      <Box>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          name="email"
          autoFocus
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <Box className="flex flex-col gap-2">
          <Button
            color="primary"
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleEmailSignIn as any}
          >
            Sign In
          </Button>

          <Button
            startIcon={<GitHubIcon />}
            color="primary"
            type="submit"
            fullWidth
            variant="outlined"
            onClick={() => handleGitHubSignIn()}
          >
            Sign In With GitHub
          </Button>
        </Box>
      </Box>
      <Grid container>
        <Grid item xs>
          <Link href="/resetpassword" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link href={ROUTES.REGISTER} variant="body2">
            Dont have an account? Sign Up
          </Link>
        </Grid>
      </Grid>
      <Typography variant="body2" color="GrayText" align="center">
        {`Copyright © ${APPLICATION_NAME} ${new Date().getFullYear()}.`}
      </Typography>
    </Box>
  );
};

export default LoginForm;
