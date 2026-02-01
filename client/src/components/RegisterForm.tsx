"use client";

import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, Link, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import "@/app/globals.css";
import { useForm } from "react-hook-form";

import { createUser } from "@/lib/actions/user";
import { APPLICATION_NAME } from "@/lib/constants";

import { ROUTES, UserSchema } from "../types";

import type { NewUser } from "../types";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewUser>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(UserSchema),
  });

  const handleFormSubmit = (newUser: NewUser) => {
    if (newUser.password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    createUser(newUser)
      .then(() => {
        signIn("credentials", {
          email: newUser.email,
          password: newUser.password,
          redirect: true,
          callbackUrl: ROUTES.RECIPES,
        });
      })
      .catch((error) => setError(error.message));
  };

  return (
    <Box className="signform">
      {error && <Alert severity="error">{error}</Alert>}
      <Typography component="h1" variant="h5">
        Sign Up
      </Typography>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoFocus
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          autoFocus
          error={!!errors.username}
          helperText={errors.username?.message}
          {...register("username")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register("password")}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          onChange={(event) => setConfirm(event.target.value)}
        />
        <Button color="primary" type="submit" fullWidth variant="contained">
          Sign Up
        </Button>
      </form>

      <Box className="flex flex-row justify-between">
        <Link href="/resetpassword" variant="body2">
          Forgot password?
        </Link>
        <Link href={ROUTES.REGISTER} variant="body2">
          Dont have an account? Sign Up
        </Link>
      </Box>
      <Typography variant="body2" color="GrayText" align="center">
        {`Copyright © ${APPLICATION_NAME} ${new Date().getFullYear()}.`}
      </Typography>
    </Box>
  );
};

export default RegisterForm;
