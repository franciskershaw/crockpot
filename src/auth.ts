import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Keep adapter for OAuth account management only
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.isAdmin = (user as { isAdmin?: boolean }).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.isAdmin = (token.isAdmin as boolean) || false;
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
});
