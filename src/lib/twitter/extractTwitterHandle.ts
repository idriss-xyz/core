
const TWITTER_HANDLE_PAGE_REGEX = /https:\/\/twitter\.com\/(\w+)/;

export const extractTwitterHandle = (url: string) => {
  const match = url.match(TWITTER_HANDLE_PAGE_REGEX);

  if (match) {
    const handle = match[1];
    return handle;
  } else {
    return undefined;
  }
};
