import { useMemo, ReactNode } from 'react';
import { Token } from '@idriss-xyz/constants';
import { AssetLogo } from '@idriss-xyz/ui/asset-logo';

import { Select } from './select';

interface Properties {
  value: string;
  label?: string;
  tokens: Token[];
  className?: string;
  onChange: (value: string) => void;
  renderRight?: () => ReactNode;
  renderLeft?: () => ReactNode;
}

export const TokenSelect = ({
  value,
  label,
  tokens,
  onChange,
  className,
  renderRight,
  renderLeft,
}: Properties) => {
  const options = useMemo(() => {
    return optionsFrom(tokens);
  }, [tokens]);

  const selectedToken = useMemo(() => {
    return tokens.find((t) => {
      return t.symbol === value;
    });
  }, [tokens, value]);

  const autoRenderLeft = selectedToken
    ? () => {
        return (
          <AssetLogo
            logo={selectedToken.logo}
            iconName={selectedToken.iconName}
            className="size-6 rounded-full"
            alt={selectedToken.symbol}
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
      renderRight={renderRight}
      renderLeft={renderLeft ?? autoRenderLeft}
    />
  );
};

const optionsFrom = (tokens: (Token & { suffix?: ReactNode })[]) => {
  return tokens.map((token) => {
    return {
      label: token.name,
      value: token.symbol,
      suffix: token.suffix,
      prefix: (
        <AssetLogo
          logo={token.logo}
          iconName={token.iconName}
          className="size-6 rounded-full"
        />
      ),
    };
  });
};
