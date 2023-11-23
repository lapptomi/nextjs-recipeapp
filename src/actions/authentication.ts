import { signOut } from "next-auth/react";

export const handleSignOut = async () => {
  if (window.confirm('Are you sure you want to sign out?')) {
    signOut({
      callbackUrl: '/recipes',
    });
  }
};