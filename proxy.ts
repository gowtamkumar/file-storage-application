import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 20, // 20 requests
  duration: 1, // per 1 second
});

export default withAuth(
  async function proxy(req) {
    const response = NextResponse.next();

    // Security Headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set(
      'Content-Security-Policy', 
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' ws: wss:;"
    );

    // Rate Limiting for API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
       try {
          const request = req as any;
          let ip = request.ip ?? request.headers.get('x-forwarded-for') ?? '127.0.0.1';
          if (ip.includes(',')) {
              ip = ip.split(',')[0];
          }
          await rateLimiter.consume(ip);
       } catch (rejRes) {
          return new NextResponse('Too Many Requests', { status: 429 });
       }
    }
    // Auth Logic
    const token = req.nextauth.token;
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    if (isDashboard && token?.role !== "admin") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/dashboard") || path.startsWith("/user") ) {
            return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', '/api/:path*'
  ],
};
