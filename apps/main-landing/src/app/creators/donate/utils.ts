import { CHAIN_ID_TO_TOKENS } from './constants';
import { SendPayload } from './schema';
import { Hex } from './types';

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

export const getSendFormDefaultValues = (
  defaultChainId: number,
  defaultTokenAddress: Hex,
): SendPayload => {
  return {
    amount: 1,
    chainId: defaultChainId,
    tokenAddress: defaultTokenAddress,
    message: '',
  };
};
