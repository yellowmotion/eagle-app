import { NextAuthOptions, getServerSession, Session, User } from "next-auth";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

import { getDatabase } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/sign-in"
  },
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
        const collection = db.collection("roles");
        const user = await collection.findOne({
          email: profile?.email,
        });
        return user != null && user.role >= 0;
      } catch {
        return false;
      }
    },
    jwt: async ({ token, profile }) => {
      const db = await getDatabase();
      const collection = db.collection("roles");
      const user = await collection.findOne({
        email: profile?.email,
      });

      token.email = profile?.email;
      token.role = user ? user.role : -1;

      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
