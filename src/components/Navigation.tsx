import { Add, FormatListBulletedOutlined, LocalDiningOutlined } from '@mui/icons-material';
import { Button, Tooltip, Typography } from '@mui/material';
import { getServerSession } from 'next-auth';

import styles from '@/styles/Navigation.module.css';

import AccountMenu from './AccountMenu';
import NotificationMenu from './NotificationMenu';
import { options } from '../app/api/auth/[...nextauth]/options';
import { APPLICATION_NAME } from '../lib/constants';

const Navigation = async () => {
  const session = await getServerSession(options);

  return (
    <div className={styles.nav}>
      <div className={styles.navbarleft}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <LocalDiningOutlined color="primary" />
          <Button size="small" color="info" href='/'>
            <Typography variant="body1">
              {APPLICATION_NAME}
            </Typography>
          </Button>
        </div>
      </div>

      <div className={styles.navbarright}>
        <Tooltip title="Browse recipes">
          <Button color="info" size="small" href="/recipes">
            <FormatListBulletedOutlined color="primary" />
            <Typography variant="overline">
              Browse
            </Typography>
          </Button>
        </Tooltip>

        {session && session.user ? (
          <>
            <Tooltip title="Create new recipe">
              <Button color="info" size="small" href="/recipes/create">
                <Add color="primary" />
                <Typography variant="overline">
                  Create
                </Typography>
              </Button>
            </Tooltip>

            <NotificationMenu user={session.user} />
            <AccountMenu user={session.user} />
          </>
        ) : (
          <>
            <Button size="small" color="info" href='/auth/login'>
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