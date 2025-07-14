import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: {
    strategy: "jwt", // Use JWT instead of database sessions for edge compatibility
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include user data in JWT token
      if (user) {
        token.sub = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      // Include token data in session
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.isAdmin = (token.isAdmin as boolean) || false;
      }
      return session;
    },
    async signIn() {
      // Allow sign in
      return true;
    },
  },
});
