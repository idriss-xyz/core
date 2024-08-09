import { useLocation } from 'react-use';

import { useCommandQuery } from 'shared/messaging';

import {
  extractTwitterHandleFromPathname,
  isTwitterHandlePathname,
  isTwitterHomePathname,
  isTwitterHostname,
} from './utils';
import { GetHandleToUsernameMapCommand } from './commands';

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

export const useHandleToUsernameMap = (
  application: string,
  enabled: boolean,
) => {
  return useCommandQuery({
    command: new GetHandleToUsernameMapCommand({}),
    select: (handles) => {
      return handles[application.toLowerCase()] ?? {};
    },
    enabled,
  });
};
