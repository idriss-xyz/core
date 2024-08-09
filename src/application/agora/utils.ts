import { CHAIN } from 'shared/web3';

import { AGORA_WEBSITE_URL, TWITTER_HANDLE_TO_AGORA } from './constants';

export const getProposalUrl = (proposalId: string) => {
  return `${AGORA_WEBSITE_URL}/proposals/${proposalId}`;
};

export const getProposerUrl = (proposerAddress: string) => {
  return `${CHAIN.OPTIMISM.blockExplorerUrls[0] ?? '#'}/address/${proposerAddress}`;
};

export const getAgoraUsernameFromTwitterUsername = (handle: string) => {
  return TWITTER_HANDLE_TO_AGORA[handle.toLowerCase()];
};

export const formatProposalAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(Math.max(0, address.length - 4))}`;
};
