import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { userRepository } from "@/data";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await userRepository.findByEmail(user.email!);

          if (!existingUser) {
            // Create new user
            await userRepository.create({
              email: user.email!,
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              googleId: user.id,
              provider: "google",
            });
          } else if (!existingUser.googleId) {
            // Update existing user with Google ID
            await userRepository.updateByEmail(user.email!, {
              googleId: user.id,
            });
          }
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await userRepository.findByEmail(user.email);

        if (dbUser) {
          token.id = dbUser.id;
          token.isAdmin = dbUser.isAdmin;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
