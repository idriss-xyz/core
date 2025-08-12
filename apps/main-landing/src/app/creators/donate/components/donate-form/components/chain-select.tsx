import { ReactNode, useMemo } from 'react';
import { CREATOR_CHAIN, Chain } from '@idriss-xyz/constants';

import { Select, Option } from './select';

interface Properties {
  value: number;
  label?: string;
  className?: string;
  allowedChainsIds?: number[];
  renderLabel?: () => ReactNode;
  onChange: (value: number) => void;
  renderRight?: () => ReactNode;
  suffixByChainId?: Record<number, ReactNode>;
}

export const ChainSelect = ({
  value,
  label,
  onChange,
  className,
  renderLabel,
  renderRight,
  allowedChainsIds,
  suffixByChainId,
}: Properties) => {
  const options = useMemo(() => {
    return getOptions(allowedChainsIds, suffixByChainId);
  }, [allowedChainsIds, suffixByChainId]);

  return (
    <Select
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={className}
      renderLabel={renderLabel}
      renderRight={renderRight}
    />
  );
};

const optionsFrom = (chain: Chain, suffix?: ReactNode): Option<number> => {
  return {
    value: chain.id,
    label: chain.name,
    suffix,
    prefix: <img src={chain.logo} className="size-6 rounded-full" alt="" />,
  };
};

const getOptions = (
  allowedChainsIds?: number[],
  suffixByChainId: Record<number, ReactNode> = {},
) => {
  if (!allowedChainsIds) {
    return Object.values(CREATOR_CHAIN).map((chain) => {
      return optionsFrom(chain, suffixByChainId[chain.id]);
    });
  }

  return allowedChainsIds.map((chainId) => {
    const foundChain = Object.values(CREATOR_CHAIN).find((chain) => {
      return chain.id === chainId;
    });

    if (!foundChain) {
      throw new Error(`${chainId} not found`);
    }

    return optionsFrom(foundChain, suffixByChainId[foundChain.id]);
  });
};
