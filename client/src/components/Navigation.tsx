import { Add } from '@mui/icons-material';
import { Button, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

import { getSession } from '@/lib/actions/auth';
import { APPLICATION_NAME } from '@/lib/constants';
import styles from '@/styles/Navigation.module.css';

import AccountMenu from './AccountMenu';

const Navigation = async () => {
  const session = await getSession();
  
  return (
    <div className={styles.nav}>
      <div className={styles.navbarleft}>
        <Link href="/">
          <Typography variant="body1" fontWeight="bold">
            {APPLICATION_NAME}
          </Typography>
        </Link>

        <Tooltip title="Home page">
          <Button variant="text" size="small" href="/">
            <Typography variant="overline" fontWeight="medium">
              Home
            </Typography>
          </Button>
        </Tooltip>

        <Tooltip title="Browse recipes">
          <Button variant="text" size="small" href="/recipes">
            <Typography variant="overline" fontWeight="medium">
              Recipes
            </Typography>
          </Button>
        </Tooltip>
      </div>

      <div className={styles.navbarright}>
        {session && session.user ? (
          <>
            <Tooltip title="Create new recipe">
              <Button size="small" href="/recipes/create">
                <Add color="primary" />
                <Typography variant="overline">
                  Create
                </Typography>
              </Button>
            </Tooltip>

            <AccountMenu user={session.user} />
          </>
        ) : (
          <>
            <Button size="small" href='/auth/login'>
              Sign in
            </Button>
            <Button size="small" variant="contained" href='/auth/register'>
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;