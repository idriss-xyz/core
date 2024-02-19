import { extractTwitterHandle } from './extractTwitterHandle';

const TWITTER_MAIN_PAGE_REGEX = /^https:\/\/twitter\.com\/home?$/;

type TwitterPageType = {
  type: 'main'
} | {
  type: 'handle';
  handle: string;
}

export const getTypeOfTwitterPage = (url: string): TwitterPageType => {
  if (TWITTER_MAIN_PAGE_REGEX.test(url)) {
    return { type: 'main' };
  }

  const handle = extractTwitterHandle(url);
  if (handle) {
    return { type: 'handle', handle };
  }

  throw new Error(`Unexpected twitter url: ${url}`)
};
