import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { hostname, pathname, search } = request.nextUrl;

  // Redirect www to non-www (canonical domain enforcement)
  if (hostname.startsWith('www.')) {
    const newHostname = hostname.replace('www.', '');
    const newUrl = new URL(`https://${newHostname}${pathname}${search}`);
    return NextResponse.redirect(newUrl, 301);
  }

  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
