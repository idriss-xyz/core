import { TWITTER_HOST_NAMES } from './constants';

export const isTwitterHostname = (hostname: string) => {
  return TWITTER_HOST_NAMES.includes(hostname);
};

export const isTwitterHandlePathname = (pathname: string) => {
  return !pathname.startsWith('/home');
};

export const extractTwitterHandleFromPathname = (pathname: string) => {
  return pathname?.split('/')[1] ?? '';
};

export const isTwitterHomePathname = (pathname: string) => {
  return pathname.startsWith('/home');
};
