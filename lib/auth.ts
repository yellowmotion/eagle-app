import { NextAuthOptions, getServerSession, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { getDatabase } from '@/lib/db';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    signIn: async ({ profile }) => {
      try {
        const db = await getDatabase();
        const collection = db.collection('roles');
        const user = await collection.findOne({
          email: profile?.email,
        });
        return user != null && user.role >= 0;
      } catch {
        return false;
      }
    },
    jwt: async ({ token, profile, account }) => {
      // Just done the login
      if (account) {
        const db = await getDatabase();
        const collection = db.collection('roles');
        const user = await collection.findOne({
          email: profile?.email,
        });

        if (!user) {
          return token;
        }

        return {
          email: user.email,
          role: user.role,
        };
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      // session.accessToken = token.accessToken
      // session.user.id = token.id
      console.log(token);
      return session;
    },
  },
  events: {
    signIn: async (message) => console.log(`[SignIn] ${message}`),
    signOut: async (message) => console.log(`[SignOut] ${message}`),
    session: async (message) => console.log(`[Session] ${message}`),
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/sign-in',
  },
  useSecureCookies: true,
};

export const getAuthSession = () => getServerSession(authOptions);
export const getJWT = (req: NextRequest) =>
  getToken({ req, secret: process.env.NEXTAUTH_SECRET });