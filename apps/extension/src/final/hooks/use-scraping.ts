import { useTwitterScraping } from 'host/twitter';
import { useWarpcastScraping } from 'host/warpcast';
import { EMPTY_SCRAPING_RESULT } from 'shared/scraping';
import { useSupercastScraping } from 'host/supercast';

import { useLocationInfo } from './use-location-info';

export const useScraping = () => {
  const { isTwitter, isWarpcast, isSupercast } = useLocationInfo();

  const twitterScraping = useTwitterScraping();
  const warpcastScraping = useWarpcastScraping();
  const supercastScraping = useSupercastScraping();

  if (isTwitter) {
    return twitterScraping;
  }

  if (isWarpcast) {
    return warpcastScraping;
  }

  if (isSupercast) {
    return supercastScraping;
  }

  return EMPTY_SCRAPING_RESULT;
};
