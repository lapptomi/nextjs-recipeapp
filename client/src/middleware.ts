import { withAuth } from 'next-auth/middleware';

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
});

// Redirect to login page if not authenticated.
// Works with regex.
export const config = {
  matcher: ['/recipes/create']
};