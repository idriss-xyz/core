import { useTwitterScraping } from 'host/twitter';
import { useWarpcastScraping } from 'host/warpcast';
import { EMPTY_SCRAPING_RESULT } from 'shared/scraping';

import { useLocationInfo } from './use-location-info';

export const useScraping = () => {
  const { isTwitter, isWarpcast } = useLocationInfo();

  const twitterScraping = useTwitterScraping();
  const warpcastScraping = useWarpcastScraping();

  if (isTwitter) {
    return twitterScraping;
  }

  if (isWarpcast) {
    return warpcastScraping;
  }

  return EMPTY_SCRAPING_RESULT;
};
