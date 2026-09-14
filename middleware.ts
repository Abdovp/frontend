import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.boyashop.store')) {
    const url = request.nextUrl.clone();
    url.host = 'boyashop.store';
    return NextResponse.redirect(url, 308);
  }

  // Add performance headers
  const response = NextResponse.next();
  
  // Enable browser caching for static assets
  if (request.nextUrl.pathname.startsWith('/images/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
