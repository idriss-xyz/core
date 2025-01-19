import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/stake', '/claim'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const password = request.cookies.get('password')?.value;

  if (
    protectedRoutes.includes(url.pathname) &&
    password !== process.env.DEV_LOGIN_PASSWORD
  ) {
    const loginUrl = new URL('/dev-login', request.url);
    loginUrl.searchParams.set('redirect', url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: protectedRoutes,
};
