import { useTwitterScraping } from 'host/twitter';
import { EMPTY_SCRAPING_RESULT } from 'shared/scraping';

import { useLocationInfo } from './use-location-info';

export const useScraping = () => {
  const { isTwitter } = useLocationInfo();

  const twitterScraping = useTwitterScraping();

  if (isTwitter) {
    return twitterScraping;
  }

  return EMPTY_SCRAPING_RESULT;
};
