import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AB_COOKIE = 'ab_price_car_charger';
const AB_PATH = '/product/car-charger';
const AB_VARIANT_B_PATH = '/product/car-charger-b';

function normalizeVariant(raw: string | undefined): 'a' | 'b' | undefined {
  if (raw === 'a' || raw === 'b') return raw;
  return undefined;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.boyashop.store')) {
    const url = request.nextUrl.clone();
    url.host = 'boyashop.store';
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;

  if (pathname === AB_VARIANT_B_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = AB_PATH;
    return NextResponse.redirect(url, 307);
  }

  if (pathname === AB_PATH) {
    const existing = normalizeVariant(request.cookies.get(AB_COOKIE)?.value);
    const variant = existing ?? (Math.random() < 0.5 ? 'a' : 'b');

    const response =
      variant === 'b'
        ? (() => {
            const rewrittenUrl = request.nextUrl.clone();
            rewrittenUrl.pathname = AB_VARIANT_B_PATH;
            return NextResponse.rewrite(rewrittenUrl);
          })()
        : NextResponse.next();

    response.cookies.set(AB_COOKIE, variant, {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
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
