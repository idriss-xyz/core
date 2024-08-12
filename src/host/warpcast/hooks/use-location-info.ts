import { useLocation } from 'react-use';

import { LocationInfo } from 'shared/location';

import {
  extractUsernameFromPathname,
  isHomePathname,
  isUserPathname,
  isWarpcastHostname,
} from '../utils';

export const useLocationInfo = (): LocationInfo => {
  const location = useLocation();

  const isHost = isWarpcastHostname(location.hostname ?? '');
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
