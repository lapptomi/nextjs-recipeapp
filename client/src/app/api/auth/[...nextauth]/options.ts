/* eslint-disable no-null/no-null */
import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

import { API_ROOT, NEXT_APP_API_URL, NEXTAUTH_SECRET } from '@/lib/constants';
import { type JwtToken, PAGES } from '@/types';

import type { NextAuthOptions } from 'next-auth';

export const options: NextAuthOptions = {
  pages: {
    signIn: PAGES.LOGIN,
    signOut: "/auth/logout",
  },
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60,  // 30 days
  },
  secret: NEXTAUTH_SECRET,
  /*
  When using JSON Web Tokens the jwt() callback is invoked before the session() callback,
  so anything you add to the JSON Web Token will be immediately available
  in the session callback, like for example an access_token or id from a provider.
  */ 
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.jwt = user.jwt;
      }
      return token;
    },
    async session ({ session, token }: any) {
      if (session.user) {
        return {
          ...session,
          user: {
            id: token.id,
            username: token.username,
            ...token,
            ...session.user,
          },
        };
      }
      return session;
    },
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
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
        }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        const { data: jwtToken } = await axios.post<JwtToken>(`${NEXT_APP_API_URL}/${API_ROOT}/auth/login`, {
          email: credentials.email,
          password: credentials.password,
        });

        if (jwtToken) {
          return {
            id: jwtToken.userId,
            email: jwtToken.email,
            username: jwtToken.username,
            name: jwtToken.username,
            jwt: jwtToken.token,
          };
        } else {
          return null;
        }
      },
    })
  ],
};