import { signIn, signOut } from "next-auth/react";

export const handleSignOut = async () => {
  if (window.confirm('Are you sure you want to sign out?')) {
    signOut({
      callbackUrl: '/recipes',
    });
  }
};

export const handleLogin = async (email: string, password: string) => {
  return signIn('credentials', {
    email,
    password,
    redirect: false,
  });
};