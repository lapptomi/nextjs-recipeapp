import { withAuth } from 'next-auth/middleware';

import { NEXTAUTH_SECRET } from './lib/config';

export default withAuth({
  secret: NEXTAUTH_SECRET,
});

// Redirect to login page if not authenticated.
// Works with regex.
export const config = {
  matcher: ['/recipes/create']
};