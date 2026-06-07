import { decodeJwt } from "jose";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { API_URL, NEXTAUTH_SECRET } from "@/lib/constants";
import { ROUTES } from "@/types";

import type { JwtTokenResponse } from "@/types";
import type { NextAuthOptions, User } from "next-auth";
import axios from "axios";

// Use a plain Axios instance without the session interceptor to avoid
// a circular dependency: options → apiClient → getSession → options
const authClient = axios.create({ baseURL: API_URL, timeout: 30000 });

type CustomUser = User & {
  accessToken: string;
  refreshToken: string;
};

async function fetchJwtToken(user: User, provider: "github" | "google"): Promise<JwtTokenResponse> {
  const { data } = await authClient.post<JwtTokenResponse>("/auth/social-login", {
    name: user.name,
    email: user.email,
    providerId: user.id,
    provider,
    image: user.image ?? null,
  });
  return data;
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const { data } = await authClient.post<JwtTokenResponse>("/auth/refresh", { refreshToken });
  return {
    accessToken: data.token,
    refreshToken: data.refreshToken,
  };
}

export const options: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTES.LOGIN,
    signOut: "/auth/logout",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update") {
        token.username = session?.name;
      }

      // Called when the user signs in
      if (user && account) {
        // Social login (GitHub / Google)
        if (account.provider === "github" || account.provider === "google") {
          const jwtToken = await fetchJwtToken(user, account.provider);
          return {
            ...token,
            id: jwtToken.userId.toString(),
            accessToken: jwtToken.token,
            refreshToken: jwtToken.refreshToken,
            username: jwtToken.username,
          };
        }

        // Credentials login (email/password)
        const { accessToken, refreshToken } = user as CustomUser;
        return {
          ...token,
          id: user.id,
          accessToken,
          refreshToken,
          username: user.name ?? undefined,
        };
      }

      // If the access token is not set, throw an error
      if (!token.accessToken) {
        throw new Error("Access token is required");
      }
      // If the access token is still valid (more than 1 minute left), return the token
      if (decodeJwt(token.accessToken).exp! - Math.floor(Date.now() / 1000) > 60) return token;

      // If the access token is expired, refresh it
      const refreshed = await refreshAccessToken(token.refreshToken!);
      return { ...token, ...refreshed };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.name = token.username as string;
        session.user.refreshToken = token.refreshToken as string;
      }
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email:", type: "text" },
        password: { label: "Password:", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid or missing credentials");
        }
        const { data: jwtToken } = await authClient.post<JwtTokenResponse>(
          "/auth/login",
          credentials
        );
        return {
          id: jwtToken.userId.toString(),
          email: jwtToken.email,
          name: jwtToken.username,
          accessToken: jwtToken.token,
          refreshToken: jwtToken.refreshToken,
        };
      },
    }),
  ],
};
