import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ts-unused-exports:disable-next-line
export function middleware(request: NextRequest) {
  if (process.env.ENVIRONMENT === 'development') {
    return NextResponse.next();
  }
  const parameters = new URLSearchParams(request.url.split('?')[1]);
  const withAuth = parameters.get('auth') === 'true';

  const isPublicAsset = ['.png', '.webm', '.ico', '.webp'].some((v) => {
    return request.url.endsWith(v);
  });

  if (!withAuth && !isPublicAsset) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-with-maintenance', 'true');
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!isAuthenticated(request)) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic' },
    });
  }

  return NextResponse.next();
}

function isAuthenticated(request: NextRequest) {
  const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
  const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

  if (!BASIC_AUTH_USER || !BASIC_AUTH_PASSWORD) {
    return false;
  }

  const authheader =
    request.headers.get('authorization') ??
    request.headers.get('Authorization');

  if (!authheader) {
    return false;
  }

  const auth = Buffer.from(authheader.split(' ')[1] ?? '', 'base64')
    .toString()
    .split(':');
  const user = auth[0];
  const pass = auth[1];

  return user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASSWORD
    ? true
    : false;
}
