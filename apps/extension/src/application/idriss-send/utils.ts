import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
import { EMPTY_HEX } from '@idriss-xyz/constants';

import { CHAIN_ID_TO_TOKENS } from 'shared/web3';

import { SendPayload } from './schema';
import { WALLET_TAGS } from './constants';

export const getDefaultTokenForChainId = (chainId: number) => {
  const chainTokens = CHAIN_ID_TO_TOKENS[chainId];
  if (!chainTokens) {
    throw new Error('Chain tokens not found');
  }

  const defaultChainToken = chainTokens[0];
  if (!defaultChainToken) {
    throw new Error('Chain does not have any tokens');
  }

  return defaultChainToken;
};

const digestMessage = (input: string) => {
  const messageUint8 = new TextEncoder().encode(input);
  const hashBuffer = sha256(messageUint8);
  const hashHex = bytesToHex(hashBuffer);
  return hashHex;
};

export const mapDigestedMessageToWalletTag = (identifier: string) => {
  return Object.fromEntries(
    WALLET_TAGS.map(({ tagAddress, tagName }) => {
      const digested = digestMessage(identifier + tagAddress);
      return [digested, tagName];
    }),
  );
};

export const getSendFormDefaultValues = (
  allowedChainsIds: number[],
): SendPayload => {
  const chainId = allowedChainsIds[0] ?? 0;
  return {
    amount: 1,
    chainId,
    tokenAddress: CHAIN_ID_TO_TOKENS[chainId]?.[0]?.address ?? EMPTY_HEX,
  };
};

export const getLoadingMessage = (isNativeToken: boolean) => {
  return isNativeToken
    ? 'Confirm transfer in your wallet'
    : 'Approve token and confirm transfer';
};
