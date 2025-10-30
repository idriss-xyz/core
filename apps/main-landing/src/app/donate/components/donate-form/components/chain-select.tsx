import { ReactNode, useMemo } from 'react';
import { CREATOR_CHAIN, Chain } from '@idriss-xyz/constants';
import { AssetLogo } from '@idriss-xyz/ui/asset-logo';

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
  renderLeft?: () => ReactNode;
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
  renderLeft,
}: Properties) => {
  const options = useMemo(() => {
    return getOptions(allowedChainsIds, suffixByChainId);
  }, [allowedChainsIds, suffixByChainId]);

  const selectedChain = useMemo<Chain | undefined>(() => {
    return (Object.values(CREATOR_CHAIN) as Chain[]).find((c) => {
      return c.id === value;
    });
  }, [value]);

  const autoRenderLeft = selectedChain
    ? () => {
        return (
          <AssetLogo
            logo={selectedChain.logo}
            iconName={selectedChain.iconName}
            className="size-6 rounded-full"
            alt={selectedChain.name}
          />
        );
      }
    : undefined;

  return (
    <Select
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={className}
      renderLabel={renderLabel}
      renderRight={renderRight}
      renderLeft={renderLeft ?? autoRenderLeft}
    />
  );
};

const optionsFrom = (chain: Chain, suffix?: ReactNode): Option<number> => {
  return {
    value: chain.id,
    label: chain.name,
    suffix,
    prefix: (
      <AssetLogo
        logo={chain.logo}
        iconName={chain.iconName}
        className="size-6 rounded-full"
        alt={chain.name}
      />
    ),
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
