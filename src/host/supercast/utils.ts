import { UNSUPPORTED_PATHNAMES, SUPERCAST_HOST_NAME } from './constants';

export const isSupercastHostname = (hostname: string) => {
  return hostname.includes(SUPERCAST_HOST_NAME);
};

const isUnsupportedPathname = (pathname: string) => {
  return UNSUPPORTED_PATHNAMES.includes(pathname);
};

export const isHomePathname = (pathname: string) => {
  if (isUnsupportedPathname(pathname)) {
    return false;
  }

  return pathname === '/';
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

  return pathname.startsWith('/channel');
};

const extractChannelnameFromPathname = (pathname: string) => {
  if (!isChannelPathname(pathname)) {
    return;
  }

  return pathname.split('/')[2];
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
