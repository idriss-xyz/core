import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DEV = process.env.ENVIRONMENT !== 'production';
console.log('DEV', DEV);

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com${DEV ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "media-src 'self' https://creators-api.idriss.xyz",
  "img-src 'self' data: blob: https://ipfs.io https://nft-cdn.alchemy.com https://nftmedia.parallelnft.com https://assets.coingecko.com https://cdn.discordapp.com https://cdn.pixabay.com https://res.cloudinary.com https://imagedelivery.net https://i.imgur.com https://storage.googleapis.com https://static-cdn.jtvnw.net https://euc.li https://idriss.xyz https://explorer-api.walletconnect.com",
  'child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org',
  'frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com',
  `connect-src 'self' https: wss:${DEV ? ' http://localhost:* ws://localhost:*' : ''}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join('; ');

// ts-unused-exports:disable-next-line
export function proxy(request: NextRequest) {
  const url = request.nextUrl;

  // Redirect www to non-www
  if (url.hostname.startsWith('www.')) {
    const newUrl = url.clone();
    newUrl.hostname = url.hostname.replace(/^www\./, '');
    return NextResponse.redirect(newUrl, { status: 301 });
  }

  const password = request.cookies.get('password')?.value;
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Content-Security-Policy', CSP);

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

// ts-unused-exports:disable-next-line
export const config = {
  matcher: '/:path*',
};
