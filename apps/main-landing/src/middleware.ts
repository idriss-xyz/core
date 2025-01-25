import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ts-unused-exports:disable-next-line
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const password = request.cookies.get('password')?.value;

  if (
    ['/staking', '/claim'].includes(url.pathname) &&
    (password !== process.env.DEV_LOGIN_PASSWORD ||
      !process.env.DEV_LOGIN_PASSWORD)
  ) {
    const loginUrl = new URL('/dev-login', request.url);
    loginUrl.searchParams.set('redirect', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ts-unused-exports:disable-next-line
export const config = {
  matcher: ['/staking', '/claim'],
};
