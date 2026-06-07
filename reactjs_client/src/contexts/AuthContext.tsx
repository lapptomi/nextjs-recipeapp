/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { getStoredAuth } from "../lib/storage";
import type { AuthUser } from "../types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextValue>(null!);

function storedAuthToUser(): AuthUser | null {
  const stored = getStoredAuth();
  if (!stored) return null;
  return {
    id: stored.userId,
    username: stored.username,
    email: stored.email,
    image: null,
    bio: null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(storedAuthToUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
