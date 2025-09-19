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
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com${DEV ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://nft-cdn.alchemy.com https://assets.coingecko.com https://cdn.discordapp.com https://cdn.pixabay.com https://res.cloudinary.com https://imagedelivery.net https://i.imgur.com https://storage.googleapis.com https://static-cdn.jtvnw.net https://euc.li https://idriss.xyz https://explorer-api.walletconnect.com",
  'child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org',
  'frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com',
  `connect-src 'self' https://nftdata.parallelnft.com https://api.idriss.xyz https://cdn.jsdelivr.net wss://creators-api.idriss.xyz https://api.mainnet.abs.xyz https://api.avax.network/ext/bc/C/rpc https://api.roninchain.com/rpc https://ethereum-rpc.publicnode.com https://base-rpc.publicnode.com https://auth.privy.io https://creators-api.idriss.xyz https://core-staging-4c69.up.railway.app https://id.twitch.tv https://api.twitch.tv https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://explorer-api.walletconnect.com https://pulse.walletconnect.org wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://api.web3modal.org${DEV ? ' http://localhost:* ws://localhost:*' : ''}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join('; ');

// ts-unused-exports:disable-next-line
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const password = request.cookies.get('password')?.value;
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  // response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('Content-Security-Policy-Report-Only', CSP);

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
