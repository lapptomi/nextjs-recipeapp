import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { NEXTAUTH_SECRET } from "@/lib/constants";
import { ROUTES } from "@/types";

import type { JwtTokenResponse } from "@/types";
import type { NextAuthOptions, User } from "next-auth";
import { apiClient } from "@/lib/apiClient";

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
  provider: SocialLoginProvider
): Promise<JwtTokenResponse> => {
  const credentials: SocialLoginCredentials = {
    name: user.name as string,
    email: user.email as string,
    providerId: user.id as string,
    provider: provider,
  };
  const { data: jwtToken } = await apiClient.post<JwtTokenResponse>(
    "/auth/social-login",
    credentials
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

      if (user && account) {
        if (account.provider === "github" || account.provider === "google") {
          // If using social login provider, such as GitHub or Google, fetch the user's JWT and add it to the token
          const jwtToken = await fetchJwtToken(user, account.provider);
          token.jwt = jwtToken.token;
          token.id = jwtToken.userId;
          token.username = jwtToken.username;
        } else if (account.provider === "credentials") {
          // If using credentials provider, add the user's ID and JWT to the token
          token.id = user.id;
          token.jwt = (user as CustomUser).jwt;
          token.username = (user as CustomUser).name;
        }
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

        const { data: jwtToken } = await apiClient.post<JwtTokenResponse>(
          "/auth/login",
          credentials
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
