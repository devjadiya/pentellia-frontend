import { NextRequest, NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/account"];
// Routes meant only for guests (redirect to dashboard if logged in)
const authRoutes = ["/login", "/signup"];

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("__session")?.value;

  // 1. Protect Dashboard Routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 2. Redirect logged-in users away from Login/Signup
  if (authRoutes.includes(pathname)) {
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
