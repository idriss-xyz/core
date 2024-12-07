import { useLocation } from 'react-use';

import { LocationInfo } from 'shared/location';

import {
  extractUsernameFromPathname,
  isHomePathname,
  isUserPathname,
  isSupercastHostname,
} from '../utils';

export const useLocationInfo = (): LocationInfo => {
  const location = useLocation();

  const isHost = isSupercastHostname(location.hostname ?? '');
  const isUserPage = isUserPathname(location.pathname ?? '');
  const isHomePage = isHomePathname(location.pathname ?? '');
  const username = extractUsernameFromPathname(location.pathname ?? '');

  return {
    isHost,
    isUserPage,
    isHomePage,
    username,
  };
};
