import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/data/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Keep adapter for OAuth account management only
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Resend({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        const { from } = provider;
        const host = new URL(url).host;

        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: identifier,
            subject: `Sign in to ${host}`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Sign in to Crockpot</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
                  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background-color: #667eea; padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                        🍲 Crockpot
                      </h1>
                      <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">
                        Your cooking companion
                      </p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 40px 30px;">
                      <h2 style="color: #1a202c; margin: 0 0 16px 0; font-size: 24px; font-weight: 600; text-align: center;">
                        Welcome back!
                      </h2>
                      <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; text-align: center;">
                        Click the button below to sign in to your Crockpot account. This link will expire in 15 minutes for your security.
                      </p>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 32px 0;">
                        <a href="${url}" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4); transition: all 0.2s ease;">
                          Sign in to Crockpot
                        </a>
                      </div>
                      
                      <!-- Security Note -->
                      <div style="background-color: #f7fafc; border-left: 4px solid #4299e1; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                        <p style="color: #2d3748; margin: 0; font-size: 14px; line-height: 1.5;">
                          <strong>🔒 Security tip:</strong> If you didn't request this sign-in link, you can safely ignore this email. Your account remains secure.
                        </p>
                      </div>
                      
                      <!-- Alternative Link -->
                      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                        <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px; text-align: center;">
                          Button not working? Copy and paste this link:
                        </p>
                        <p style="color: #4299e1; margin: 0; font-size: 12px; word-break: break-all; text-align: center; background-color: #f7fafc; padding: 12px; border-radius: 6px; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;">
                          ${url}
                        </p>
                      </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="color: #718096; margin: 0; font-size: 14px;">
                        This email was sent from <strong>${host}</strong>
                      </p>
                      <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 12px;">
                        © 2024 Crockpot. All rights reserved.
                      </p>
                    </div>
                  </div>
                </body>
              </html>
            `,
            text: `Sign in to ${host}\n\nClick the link below to sign in to your Crockpot account:\n${url}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this sign-in link, you can safely ignore this email.\n\n© 2024 Crockpot. All rights reserved.`,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.session-token`
          : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Secure-next-auth.callback-url`
          : `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? `__Host-next-auth.csrf-token`
          : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: UserRole }).role || "FREE";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as UserRole) || "FREE";
      }
      return session;
    },
    async signIn() {
      return true;
    },
  },
});
