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
  renderSuffix?: (chainId: number) => ReactNode;
}

export const ChainSelect = ({
  value,
  label,
  onChange,
  className,
  renderLabel,
  renderSuffix,
  allowedChainsIds,
}: Properties) => {
  const options = useMemo(() => {
    return getOptions(allowedChainsIds, renderSuffix);
  }, [allowedChainsIds, renderSuffix]);

  return (
    <Select
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={className}
      renderLabel={renderLabel}
    />
  );
};

const optionsFrom = (
  chain: Chain,
  renderSuffix?: (chainId: number) => ReactNode,
): Option<number> => {
  return {
    value: chain.id,
    label: chain.name,
    suffix: renderSuffix?.(chain.id),
    prefix: <img src={chain.logo} className="size-6 rounded-full" alt="" />,
  };
};

const getOptions = (
  allowedChainsIds?: number[],
  renderSuffix?: (chainId: number) => ReactNode,
) => {
  if (!allowedChainsIds) {
    return Object.values(CREATOR_CHAIN).map((chain) => {
      return optionsFrom(chain, renderSuffix);
    });
  }

  return allowedChainsIds.map((chainId) => {
    const foundChain = Object.values(CREATOR_CHAIN).find((chain) => {
      return chain.id === chainId;
    });

    if (!foundChain) {
      throw new Error(`${chainId} not found`);
    }

    return optionsFrom(foundChain, renderSuffix);
  });
};
