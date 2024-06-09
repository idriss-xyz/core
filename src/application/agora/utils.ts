import { TwitterUserPoolingResult } from 'host/twitter';

import { AGORA_WEBSITE_URL, TWITTER_HANDLE_TO_AGORA } from './constants';

export const getProposalUrl = (proposalId: string) => {
  return `${AGORA_WEBSITE_URL}/proposals/${proposalId}`;
};

export const getAgoraUsernameFromTwitterUsername = (handle: string) => {
  return TWITTER_HANDLE_TO_AGORA[handle.toLowerCase()];
};

export const getAgoraUserNodes = (
  poolingResults: TwitterUserPoolingResult[],
) => {
  return poolingResults
    .map((result) => {
      const agoraUsername = getAgoraUsernameFromTwitterUsername(
        result.username,
      );
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
