import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ts-unused-exports:disable-next-line
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const password = request.cookies.get('password')?.value;
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');

  if (
    ['/vault', '/claim'].includes(url.pathname) &&
    process.env.PUBLIC_ACCESS_ENABLED !== 'true' &&
    (password !== process.env.DEV_LOGIN_PASSWORD ||
      !process.env.DEV_LOGIN_PASSWORD)
  ) {
    const loginUrl = new URL('/dev-login', request.url);
    loginUrl.searchParams.set('redirect', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: '/:path*',
};
