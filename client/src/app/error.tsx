/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Alert, Button, Typography } from "@mui/material";

import { PAGES } from "@/types";

export default function ErrorPage({ error }: {
  readonly error: Error & { digest?: string }
}) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-5'>
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