import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import RegisterForm from '@/components/RegisterForm';
import styles from '@/styles/RegisterPage.module.css';

const RegisterPage = () => {
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        md={7}
        className={styles.maingrid}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <RegisterForm />
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;