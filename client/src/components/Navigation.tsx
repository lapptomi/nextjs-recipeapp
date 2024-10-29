import { Add } from '@mui/icons-material';
import { Button, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

import { getSession } from '@/lib/actions/auth';
import { APPLICATION_NAME } from '@/lib/constants';
import { PAGES } from '@/types';

import AccountMenu from './AccountMenu';

const Navigation = async () => {
  const session = await getSession();

  return (
    <div className='flex w-full flex-row justify-between border-b border-gray-200 bg-white px-8 py-2'>
      <div className='flex flex-row items-center gap-2'>
        <Link href={PAGES.HOME}>
          <Typography variant="body1" fontWeight="">
            {APPLICATION_NAME}
          </Typography>
        </Link>

        <Tooltip title="Home page">
          <Button variant="text" size="small" href={PAGES.HOME}>
            <Typography variant="overline" fontWeight="medium">
              Home
            </Typography>
          </Button>
        </Tooltip>

        <Tooltip title="Browse recipes">
          <Button variant="text" size="small" href={PAGES.RECIPES}>
            <Typography variant="overline" fontWeight="medium">
              Recipes
            </Typography>
          </Button>
        </Tooltip>
      </div>

      <div className='flex flex-row items-center gap-2'>
        {session && session.user ? (
          <>
            <Tooltip title="Create new recipe">
              <Button size="small" href={PAGES.CREATE_RECIPE}>
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
            <Button size="small" href={PAGES.LOGIN}>
              Sign in
            </Button>
            <Button size="small" variant="contained" href={PAGES.REGISTER}>
              Sign up
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navigation;