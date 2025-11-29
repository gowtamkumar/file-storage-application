import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isUserPanel = req.nextUrl.pathname.startsWith("/user");

    if (isDashboard && token?.role !== "admin") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
    
    if (isUserPanel && !isAuth) {
       return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/user/:path*"] };
