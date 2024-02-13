import {
  TWITTER_HANDLE_PAGE_REGEX,
  TWITTER_MAIN_PAGE_REGEX,
} from '../constants';

export const extractTwitterHandle = (url: string) => {
  const match = url.match(TWITTER_HANDLE_PAGE_REGEX);

  if (match) {
    const handle = match[1];
    return handle;
  } else {
    return undefined;
  }
};

export const getTwitterStrategy = (url: string) => {
  if (TWITTER_MAIN_PAGE_REGEX.test(url)) {
    return 'main';
  }
  const handle = extractTwitterHandle(url);
  if (handle) {
    return 'handle';
  }

  return undefined;
};
