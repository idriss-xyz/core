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

export const isHandleNode = (element: HTMLElement) => {
  let currentElement: HTMLElement | null = element;
  for (let index = 0; index < 10; index++) {
    currentElement = currentElement.parentElement;
    if (!currentElement) {
      return false; // If there are less than 3 parents
    }
    if (currentElement.dataset.testid === 'UserName') {
      return true;
    }
  }
  return false;
};
