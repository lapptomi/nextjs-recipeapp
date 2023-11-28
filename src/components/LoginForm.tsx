"use client";

import React, { useState } from "react";

import { Alert, Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

import { APPLICATION_NAME } from "@/lib/constants";

const LoginForm: React.FC = () => {
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signIn('credentials', {
      email: data.get('email'),
      password: data.get('password'),
      redirect: false,
    })
      .then((res) => {
        if (res?.error) {
          throw new Error(res.error);
        } else {
          window.location.replace('/recipes');
        }
      })
      .catch(() => {
        setError('Invalid or missing credentials');
      });
  };
  
  return (
    <div className="signform">
      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit}>
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
        <Button
          color="primary"
          type="submit"
          fullWidth
          variant="contained"
        >
          Sign In
        </Button>
      </Box>
      <Grid container>
        <Grid item xs>
          <Link href="/resetpassword" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link href="/auth/register" variant="body2">
            Dont have an account? Sign Up
          </Link>
        </Grid>
      </Grid>
      <Typography variant="body2" color="GrayText" align="center">
        {`Copyright © ${APPLICATION_NAME} ${new Date().getFullYear()}.`}
      </Typography>
    </div>
  );
};

export default LoginForm;