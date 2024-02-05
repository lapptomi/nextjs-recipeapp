import { withAuth } from 'next-auth/middleware';

import NextConfig from '../src/lib/config';

export default withAuth({
  secret: NextConfig.NEXTAUTH_SECRET
});

// Redirect to login page if not authenticated.
// Works with regex.
export const config = {
  matcher: ['/recipes/create']
};