import { NextAuthOptions, getServerSession} from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { getDatabase } from "@/lib/db";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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
        const collection = db.collection("roles");
        const user = await collection.findOne({
          email: profile?.email,
        });
        return user != null && user.role >= 0;
      } catch {
        return false;
      }
    },
    jwt: async ({ token, user, account, profile }) => {
      // Just done the login
      if (profile && account) {
        const db = await getDatabase();
        const collection = db.collection("roles");
        const user = await collection.findOne({
          email: profile?.email,
        });

        if (!user) {
          return token;
        }

        return {
          ...token,
          // email: user.email, // è già presente nel token
          role: user.role,
        };
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      if (session.user) {
        session.user.role = token.role;
        return session;
      }
      return session;
    },
  },
  events: {
    signIn: async (message) =>
      console.log(`[SignIn] ${JSON.stringify(message)}`),
    signOut: async (message) =>
      console.log(`[SignOut] ${JSON.stringify(message)}`),
    session: async (message) =>
      console.log(`[Session] ${JSON.stringify(message)}`),
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
  },
};

export const getAuthSession = () => getServerSession(authOptions);
export const getJWT = (req: NextRequest) =>
  getToken({ req, secret: process.env.NEXTAUTH_SECRET });