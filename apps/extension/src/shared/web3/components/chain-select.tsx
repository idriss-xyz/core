import { ReactNode, useMemo } from 'react';

import { Select, Option } from 'shared/ui';

import { Chain } from '../types';
import { CHAIN } from '../constants';

interface Properties {
  value: number;
  label?: string;
  renderLabel?: () => ReactNode;
  className?: string;
  onChange: (value: number) => void;
  allowedChainsIds?: number[];
  renderSuffix?: (chainId: number) => ReactNode;
}

export const ChainSelect = ({
  value,
  label,
  onChange,
  className,
  allowedChainsIds,
  renderSuffix,
  renderLabel,
}: Properties) => {
  const options = useMemo(() => {
    return getOptions(allowedChainsIds, renderSuffix);
  }, [allowedChainsIds, renderSuffix]);

  return (
    <Select
      className={className}
      label={label}
      renderLabel={renderLabel}
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};

const optionsFrom = (
  chain: Chain,
  renderSuffix?: (chainId: number) => ReactNode,
): Option<number> => {
  return {
    label: chain.name,
    value: chain.id,
    prefix: <img src={chain.logo} className="size-6 rounded-full" alt="" />,
    suffix: renderSuffix?.(chain.id),
  };
};

const getOptions = (
  allowedChainsIds?: number[],
  renderSuffix?: (chainId: number) => ReactNode,
) => {
  if (!allowedChainsIds) {
    return Object.values(CHAIN).map((chain) => {
      return optionsFrom(chain, renderSuffix);
    });
  }

  return allowedChainsIds.map((chainId) => {
    const foundChain = Object.values(CHAIN).find((chain) => {
      return chain.id === chainId;
    });
    if (!foundChain) {
      throw new Error(`${chainId} not found`);
    }
    return optionsFrom(foundChain, renderSuffix);
  });
};
