import { ReactNode } from 'react';

import { Option } from 'shared/ui/components';
import { CHAIN } from 'shared/web3/web3.constants';

import { Chain } from '../../web3.types';

const chainToOption = (
  chain: Chain,
  renderSuffix?: (chainId: number) => ReactNode,
): Option<number> => {
  return {
    label: chain.name,
    value: chain.id,
    prefix: <img src={chain.logo} className="size-4" alt="" />,
    suffix: renderSuffix?.(chain.id),
  };
};

export const getOptions = (
  allowedChainsIds?: number[],
  renderSuffix?: (chainId: number) => ReactNode,
) => {
  if (!allowedChainsIds) {
    return Object.values(CHAIN).map((chain) => {
      return chainToOption(chain, renderSuffix);
    });
  }
  return allowedChainsIds.map((chainId) => {
    const foundChain = Object.values(CHAIN).find((chain) => {
      return chain.id === chainId;
    });
    if (!foundChain) {
      throw new Error(`${chainId} not found`);
    }
    return chainToOption(foundChain, renderSuffix);
  });
};
