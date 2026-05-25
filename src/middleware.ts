import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'airi-fallback-change-me');

const intlMiddleware = createMiddleware(routing);

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(`/${locale}`.length) || '/';
    }
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cleanPath = stripLocalePrefix(pathname);

  if (cleanPath.startsWith('/mydashboard') || cleanPath.startsWith('/api/')) {
    if (cleanPath === '/mydashboard/login') {
      const token = request.cookies.get('airi_session')?.value;
      if (token) {
        try {
          await jwtVerify(token, SECRET);
          return NextResponse.redirect(new URL('/mydashboard', request.url));
        } catch {
          // invalid token
        }
      }
      return NextResponse.next();
    }

    if (cleanPath.startsWith('/mydashboard')) {
      const token = request.cookies.get('airi_session')?.value;
      if (!token) {
        return NextResponse.redirect(new URL('/mydashboard/login', request.url));
      }
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.next();
      } catch {
        const response = NextResponse.redirect(new URL('/mydashboard/login', request.url));
        response.cookies.delete('airi_session');
        return response;
      }
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|images|favicon\\.ico|.*\\..*).*)'],
};
