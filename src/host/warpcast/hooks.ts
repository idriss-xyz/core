import { useLocation } from 'react-use';

import { isWarpcastHostname } from './utils';

export const useWarpcastLocationInfo = () => {
  const location = useLocation();

  const isWarpcast = isWarpcastHostname(location.hostname ?? '');

  return {
    isWarpcast,
  };
};
