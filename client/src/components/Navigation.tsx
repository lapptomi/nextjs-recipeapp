import { Add, ListAltOutlined } from '@mui/icons-material';
import { Button, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';
import { getServerSession } from 'next-auth';

import config from '@/lib/config';
import styles from '@/styles/Navigation.module.css';

import AccountMenu from './AccountMenu';
import { options } from '../app/api/auth/[...nextauth]/options';

const Navigation = async () => {
  const session = await getServerSession(options);
  
  return (
    <div className={styles.nav}>
      <div className={styles.navbarleft}>
        <Link href="/">
          <Typography variant="body1" fontWeight="medium">
            {config.APPLICATION_NAME}
          </Typography>
        </Link>

        <Tooltip title="Browse recipes">
          <Button size="small" href="/recipes">
            <ListAltOutlined />
            <Typography variant="overline">
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