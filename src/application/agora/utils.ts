import { ScrapingResult } from 'shared/scraping';

import { AGORA_WEBSITE_URL, TWITTER_HANDLE_TO_AGORA } from './constants';

export const getProposalUrl = (proposalId: string) => {
  return `${AGORA_WEBSITE_URL}/proposals/${proposalId}`;
};

export const getAgoraUsernameFromTwitterUsername = (handle: string) => {
  return TWITTER_HANDLE_TO_AGORA[handle.toLowerCase()];
};

export const getAgoraWidgetsInfo = (poolingResults: ScrapingResult[]) => {
  return poolingResults
    .map((result) => {
      const agoraUsername = getAgoraUsernameFromTwitterUsername(result.value);
      if (!agoraUsername) {
        return;
      }

      return {
        agoraUsername,
        ...result,
      };
    })
    .filter(Boolean);
};
