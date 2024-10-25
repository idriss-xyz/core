import { CHAIN, getBlockExplorerUrl } from 'shared/web3';

import { AGORA_WEBSITE_URL } from './constants';

export const getProposalUrl = (proposalId: string) => {
  return `${AGORA_WEBSITE_URL}/proposals/${proposalId}`;
};

export const getProposerUrl = (proposerAddress: string) => {
  const blockExplorerUrl = getBlockExplorerUrl(CHAIN.OPTIMISM.id);
  if (!blockExplorerUrl) {
    return '#';
  }

  return `${blockExplorerUrl}/address/${proposerAddress}`;
};

export const formatProposalAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(Math.max(0, address.length - 4))}`;
};
