/* eslint-disable no-null/no-null */
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { API_URL, NEXTAUTH_SECRET } from "@/lib/constants";
import { ROUTES } from "@/types";

import type { JwtTokenResponse } from "@/types";
import type { NextAuthOptions, User } from "next-auth";

type SocialLoginProvider = "github" | "google";

interface SocialLoginCredentials {
  name: string;
  email: string;
  providerId: string;
  provider: SocialLoginProvider;
}

type CustomUser = User & {
  id: string;
  jwt: string;
  name: string;
};

const fetchJwtToken = async (
  user: User,
  provider: SocialLoginProvider,
): Promise<JwtTokenResponse> => {
  const credentials: SocialLoginCredentials = {
    name: user.name as string,
    email: user.email as string,
    providerId: user.id as string,
    provider: provider,
  };
  const { data: jwtToken } = await axios.post<JwtTokenResponse>(
    `${API_URL}/auth/social-login`,
    credentials,
  );
  return jwtToken;
};

export const options: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  pages: {
    signIn: ROUTES.LOGIN,
    signOut: "/auth/logout",
  },
  /*
  When using JSON Web Tokens the jwt() callback is invoked before the session() callback,
  so anything you add to the JSON Web Token will be immediately available
  in the session callback, like for example an access_token or id from a provider.
  */
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // If the user is updating their name, update the session with the new name
      if (trigger === "update") {
        token.username = session?.name;
      }
      // If using credentials provider, add the user's ID and JWT to the token
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.jwt = (user as CustomUser).jwt;
        token.username = (user as CustomUser).name;
      }
      // If using GitHub provider, fetch the user's JWT and add it to the token
      if (user && account?.provider === "github") {
        const jwtToken = await fetchJwtToken(user, "github");
        console.log("JWT TOKEN ", jwtToken);
        token.jwt = jwtToken.token;
        token.id = jwtToken.userId;
        token.username = jwtToken.username;
      }
      // If using Google provider, fetch the user's JWT and add it to the token
      if (user && account?.provider === "google") {
        const jwtToken = await fetchJwtToken(user, "google");
        token.jwt = jwtToken.token;
        token.id = jwtToken.userId;
        token.username = jwtToken.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.jwt = token.jwt as string;
        session.user.name = token.username as string;
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
        email: {
          label: "Email:",
          type: "text",
        },
        password: {
          label: "Password:",
          type: "password",
        },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials || !credentials?.email || !credentials?.password) {
          throw new Error("Invalid or missing credentials");
        }

        const { data: jwtToken } = await axios.post<JwtTokenResponse>(
          `${API_URL}/auth/login`,
          credentials,
        );

        if (!jwtToken.token) {
          return null;
        }

        return {
          id: jwtToken.userId.toString(),
          email: jwtToken.email,
          name: jwtToken.username,
          jwt: jwtToken.token,
        } as CustomUser;
      },
    }),
  ],
};
