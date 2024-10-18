/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, Button, Typography } from "@mui/material";

import { PAGES } from "@/types";

import styles from "./error.module.css";

export default function ErrorPage({ error }: {
  error: Error & { digest?: string }
}) {
  return (
    <div className={styles.errorpage}>
      <Typography variant="h1">
        404
      </Typography>
      <Typography variant="h5">
        Something went wrong or the page you are looking for does not exist.
      </Typography>
      <Alert severity="warning">
        {error.message}
      </Alert>
      <Button href={PAGES.HOME} variant="contained">Back Home</Button>
    </div>
  );
};