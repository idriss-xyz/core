import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';

import { CHAIN_ID_TO_TOKENS } from 'shared/web3';

import { IconType, SendPayload } from './schema';
import { ICON_TYPE_TO_SRC, WALLET_TAGS } from './constants';

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

export const getIconSource = (iconType: IconType) => {
  return ICON_TYPE_TO_SRC[iconType];
};

export const getSafeNumber = (
  number: number,
): { value: number; decimals: number } => {
  // Convert the number to a string and split by the decimal point
  const numberString = number.toString();

  // Check if there is a decimal point in the number
  if (numberString.includes('.')) {
    const parts = numberString.split('.');
    const decimals = parts[1]?.length ?? 0;
    const value = number * 10 ** decimals;
    return { value: Math.floor(value), decimals };
  } else {
    // If no decimal point, the number is an integer
    const value = Number.parseInt(numberString, 10);
    return { value, decimals: 0 };
  }
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
    tokenAddress: CHAIN_ID_TO_TOKENS[chainId]?.[0]?.address ?? '0x',
  };
};

export const getLoadingMessage = (isNativeToken: boolean) => {
  return isNativeToken
    ? 'Confirm transfer in your wallet'
    : 'Approve token and confirm transfer';
};
