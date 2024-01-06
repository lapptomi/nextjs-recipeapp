"use client";

import { Button, Typography } from "@mui/material";

const ErrorPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        gap: '20px'
      }}
    >
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