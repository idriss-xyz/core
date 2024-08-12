import { UNSUPPORTED_PATHNAMES, WARPCAST_HOST_NAME } from './constants';
import { WarpcastHostName } from './types';

export const isWarpcastHostname = (
  hostname: string,
): hostname is WarpcastHostName => {
  return hostname === WARPCAST_HOST_NAME;
};

const isUnsupportedPathname = (pathname: string) => {
  return UNSUPPORTED_PATHNAMES.includes(pathname);
};

export const isHomePathname = (pathname: string) => {
  if (isUnsupportedPathname(pathname)) {
    return false;
  }

  return pathname === '/' || pathname.startsWith('/~/trending');
};

export const isUserPathname = (pathname: string) => {
  if (isUnsupportedPathname(pathname)) {
    return false;
  }

  return !isHomePathname(pathname);
};

const isChannelPathname = (pathname: string) => {
  if (isUnsupportedPathname(pathname)) {
    return false;
  }

  return pathname.startsWith('/~/channel');
};

const extractChannelnameFromPathname = (pathname: string) => {
  if (!isChannelPathname(pathname)) {
    return;
  }

  return pathname.split('/')[3];
};

export const extractUsernameFromPathname = (pathname: string) => {
  // we consider channels as users
  if (isChannelPathname(pathname)) {
    return extractChannelnameFromPathname(pathname);
  }

  if (!isUserPathname(pathname)) {
    return;
  }

  return pathname?.split('/')[1];
};
