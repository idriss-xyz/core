import { useLocation } from 'react-use';

import { usePooling } from 'shared/ui';

import { Twitter } from './twitter';
import {
  extractTwitterHandleFromPathname,
  isTwitterHandlePathname,
  isTwitterHomePathname,
  isTwitterHostname,
} from './utils';

export const useTwitterUsersPooling = () => {
  const { isTwitter } = useTwitterLocationInfo();

  return usePooling({
    defaultValue: [],
    callback: Twitter.getUsers,
    enabled: isTwitter,
  });
};

export const useTweetAuthorsPooling = () => {
  const { isTwitter } = useTwitterLocationInfo();

  return usePooling({
    defaultValue: [],
    callback: Twitter.getTweetAuthors,
    enabled: isTwitter,
  });
};

export const useTwitterExternalLinksPooling = () => {
  const { isTwitter } = useTwitterLocationInfo();

  return usePooling({
    defaultValue: [],
    callback: Twitter.getExternalLinks,
    enabled: isTwitter,
  });
};

export const useTwitterLocationInfo = () => {
  const location = useLocation();

  const isTwitter = isTwitterHostname(location.hostname ?? '');
  const isTwitterHandlePage = isTwitterHandlePathname(location.pathname ?? '');
  const isTwitterHomePage = isTwitterHomePathname(location.pathname ?? '');
  const twitterHandleFromPathname = extractTwitterHandleFromPathname(
    location.pathname ?? '',
  );

  return {
    isTwitter,
    isTwitterHandlePage,
    isTwitterHomePage,
    twitterHandleFromPathname,
  };
};
