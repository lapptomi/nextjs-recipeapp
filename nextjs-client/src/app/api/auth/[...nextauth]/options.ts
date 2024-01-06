/* eslint-disable no-null/no-null */
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';

import { prisma } from '../../../../lib/db';

import type { NextAuthOptions } from 'next-auth';

export const options: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
  },
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60,  // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  /*
  When using JSON Web Tokens the jwt() callback is invoked before the session() callback,
  so anything you add to the JSON Web Token will be immediately available
  in the session callback, like for example an access_token or id from a provider.
  */ 
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
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

        const user = await prisma.user.findUnique({ where: {
          email: credentials?.email,
        }});

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const passwordsMatch = await bcrypt.compare(credentials?.password, user.password);
        const validCredentials = (
          credentials?.email === user.email  &&
          passwordsMatch
        );

        if (validCredentials) {
          return {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.username,
          };
        } else {
          return null;
        }
      },
    })
  ],
};