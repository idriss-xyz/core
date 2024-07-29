import { MAX_PARENT_NODES_TO_CHECK, TWITTER_HOST_NAMES } from './constants';

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
  for (let index = 0; index < MAX_PARENT_NODES_TO_CHECK; index++) {
    currentElement = currentElement.parentElement;
    if (!currentElement) {
      return false;
    }
    if (currentElement.dataset.testid === 'UserName') {
      return true;
    }
  }
  return false;
};

export const getNodeToInjectToUser = (node: Element, isHandleUser: boolean) => {
  const nodeToInject = isHandleUser
    ? node.querySelector('div > div > div > span') ??
      node.querySelector('div > div > a > div')
    : node.querySelector('div > div > a > div') ??
      node.querySelector('div:has(> div > span)');

  return nodeToInject as HTMLElement | null;
};
