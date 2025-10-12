// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/data/types";

// Define route patterns
const PROTECTED_ROUTES = ["/your-crockpot", "/recipes/new", "/recipes/edit"];

const ADMIN_ROUTES = ["/admin"];

const PUBLIC_ROUTES = ["/", "/recipes", "/api", "/_next", "/favicon.ico"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith("/_next") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Get session from NextAuth
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRole = session?.user?.role as UserRole;

  // Handle homepage redirects
  if (pathname === "/") {
    if (isAuthenticated) {
      // Logged in users get redirected to your-crockpot
      return NextResponse.redirect(new URL("/your-crockpot", request.url));
    }
    // Not logged in users stay on homepage
    return NextResponse.next();
  }

  // Handle protected routes (require authentication)
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Handle admin routes (require ADMIN role)
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    if (!isAuthenticated || userRole !== UserRole.ADMIN) {
      // Return 404 for non-admin users trying to access admin routes
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }

  // Handle recipe edit routes (require ownership or admin)
  if (pathname.startsWith("/recipes/edit/")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // For recipe ownership check, we'll let the page component handle it
    // since we need to fetch the recipe data to check ownership
    // This prevents the middleware from making database calls
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, except auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
