import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // const { nextUrl } = req;
  // const isLoggedIn = !!req.auth;

  // Redirect authenticated users away from landing page
  // if (isLoggedIn && nextUrl.pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", nextUrl));
  // }

  // Protect dashboard routes - redirect unauthenticated users to home
  // if (nextUrl.pathname.startsWith("/dashboard") && !isLoggedIn) {
  //   return NextResponse.redirect(new URL("/", nextUrl));
  // }

  // Allow access to other routes
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
