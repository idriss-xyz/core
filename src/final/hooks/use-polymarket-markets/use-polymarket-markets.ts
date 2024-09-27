import { useLocationInfo } from '../use-location-info';

import { useTwitterMarkets } from './use-twitter-markets';

export const usePolymarketMarkets = () => {
  const { isTwitter } = useLocationInfo();

  const twitterMarkets = useTwitterMarkets({ enabled: isTwitter });

  return twitterMarkets;
};
