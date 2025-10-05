import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { hasPermission, Permission } from "@/lib/action-helpers";
import { UserRole } from "@/data/types";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Redirect authenticated users away from landing page
  if (isLoggedIn && nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/your-crockpot", nextUrl));
  }

  // Protect authenticated routes - redirect unauthenticated users to home
  if (nextUrl.pathname.startsWith("/your-crockpot") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Protect premium routes - require PREMIUM, PRO, or ADMIN role
  if (nextUrl.pathname.startsWith("/recipes/new")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    if (!hasPermission(userRole as UserRole, Permission.CREATE_RECIPES)) {
      return NextResponse.redirect(new URL("/your-crockpot", nextUrl));
    }
  }

  // Allow access to other routes with security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Add Permissions Policy header to restrict potentially dangerous features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
