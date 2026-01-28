/* eslint-disable no-null/no-null */
import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

import { API_URL, NEXTAUTH_SECRET } from "@/lib/constants";
import { ROUTES } from "@/types";

import type { JwtTokenResponse } from "@/types";
import type { NextAuthOptions, User } from "next-auth";

interface SocialLoginCredentials {
  name: string;
  email: string;
  providerId: string;
}

type CustomUser = User & {
  id: string;
  jwt: string;
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
    async jwt({ token, user, account }) {
      // If using credentials provider, add the user's ID and JWT to the token
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.jwt = (user as CustomUser).jwt;
      }
      // If using GitHub provider, fetch the user's JWT and add it to the token
      if (user && account?.provider === "github") {
        const credentials: SocialLoginCredentials = {
          name: user.name as string,
          email: user.email as string,
          providerId: user.id as string,
        };
        const { data: jwtToken } = await axios.post<JwtTokenResponse>(
          `${API_URL}/auth/social-login`,
          credentials,
        );
        token.jwt = jwtToken.token;
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.jwt = token.jwt as string;
      }
      return session;
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const { data: jwtToken } = await axios.post<JwtTokenResponse>(
          `${API_URL}/auth/login`,
          {
            email: credentials.email,
            password: credentials.password,
          },
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
