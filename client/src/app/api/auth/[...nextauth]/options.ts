import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { NEXTAUTH_SECRET } from "@/lib/constants";
import { ROUTES } from "@/types";

import type { JwtTokenResponse } from "@/types";
import type { NextAuthOptions, User } from "next-auth";
import { apiClient } from "@/lib/apiClient";

type CustomUser = User & {
  id: string;
  accessToken: string;
  refreshToken: string;
  name: string;
};

function getTokenExpiry(token: string): number {
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
  return payload.exp as number; // Unix epoch seconds, set by the backend
}

async function fetchJwtToken(user: User, provider: "github" | "google"): Promise<JwtTokenResponse> {
  const { data } = await apiClient.post<JwtTokenResponse>("/auth/social-login", {
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
  accessTokenExpires: number;
}> {
  const res = await fetch(`${process.env.NEXT_APP_API_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    throw new Error(`Refresh token expired or invalid (${res.status})`);
  }
  const data = (await res.json()) as JwtTokenResponse;
  return {
    accessToken: data.token,
    refreshToken: data.refreshToken,
    accessTokenExpires: getTokenExpiry(data.token),
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
      console.log("[jwt callback]", { trigger, user, token });
      // Called when the user updates their profile (e.g. username change)
      if (trigger === "update") {
        token.username = session?.name;
      }

      // Called once on initial sign-in — populate the token with data from the backend
      if (user && account) {
        // Social login (GitHub / Google) — exchange OAuth user for a backend JWT
        if (account.provider === "github" || account.provider === "google") {
          const jwtToken = await fetchJwtToken(user, account.provider);
          return {
            ...token,
            id: jwtToken.userId.toString(),
            accessToken: jwtToken.token,
            refreshToken: jwtToken.refreshToken,
            accessTokenExpires: getTokenExpiry(jwtToken.token),
            username: jwtToken.username,
          };
        }
        // Credentials login — token fields come from the authorize() callback
        return {
          ...token,
          id: user.id,
          accessToken: (user as CustomUser).accessToken,
          refreshToken: (user as CustomUser).refreshToken,
          accessTokenExpires: getTokenExpiry((user as CustomUser).accessToken),
          username: (user as CustomUser).name,
        };
      }

      // Token still valid (more than 1 minute left), no refresh needed
      if ((token.accessTokenExpires ?? 0) - Math.floor(Date.now() / 1000) > 60) return token;

      // Access token expired or expiring soon — refresh it
      const refreshed = await refreshAccessToken(token.refreshToken!);
      return { ...token, ...refreshed };
    },
    async session({ session, token }) {
      console.log("[session callback]", { session, token });
      if (session.user) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken as string;
        session.user.name = token.username as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.accessTokenExpires = token.accessTokenExpires as number;
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
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Invalid or missing credentials");
        }
        const { data: jwtToken } = await apiClient.post<JwtTokenResponse>(
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
