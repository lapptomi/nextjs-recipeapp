"use client";

import { Button, Typography } from "@mui/material";

import styles from "./error.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.errorpage}>
      <Typography variant="h1">
        404
      </Typography>
      <Typography variant="h5">
        Something went wrong or the page you are looking for does not exist.
      </Typography>
      <Button href="/" variant="contained">Back Home</Button>
    </div>
  );
};

export default ErrorPage;