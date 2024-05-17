export const isTwitterHostname = (hostname: string) => {
  return hostname === 'twitter.com' || hostname === 'x.com';
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
