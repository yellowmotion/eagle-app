import { getDatabase } from '@/lib/db';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
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
    jwt: async ({ token, profile }) => {
      const db = await getDatabase();
      const collection = db.collection('roles');
      const user = await collection.findOne({
        email: profile?.email,
      });

      token.email = profile?.email;
      token.role = user ? user.role : -1;

      return token;
    },
  },
});

export { handler as GET, handler as POST };
