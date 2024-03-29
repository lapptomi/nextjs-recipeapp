import { Box, Grid, Paper } from "@mui/material";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/actions/auth";

import styles from "./layout.module.css";

const PageLayout = async ({ children }: any) => {
  const session = await getSession();

  if (session?.user) {
    redirect('/');
  }

  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid md={7} item className={styles.maingrid} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        {/* TODO: use css instead of Mui styling */}
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {children}
        </Box>
      </Grid>
    </Grid>
  );
};

export default PageLayout;