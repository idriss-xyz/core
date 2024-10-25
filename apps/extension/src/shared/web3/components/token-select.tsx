import { useMemo } from 'react';

import { Select } from 'shared/ui';

import { ChainToken } from '../types';

interface Properties {
  value: string;
  label?: string;
  className?: string;
  tokens: ChainToken[];
  onChange: (value: string) => void;
}

export const TokenSelect = ({
  value,
  label,
  onChange,
  tokens,
  className,
}: Properties) => {
  const options = useMemo(() => {
    return optionsFrom(tokens);
  }, [tokens]);

  return (
    <Select
      className={className}
      label={label}
      options={options}
      onChange={onChange}
      value={value}
    />
  );
};

const optionsFrom = (tokens: ChainToken[]) => {
  return tokens.map((token) => {
    return {
      label: token.name,
      value: token.address,
      prefix: (
        <img
          src={token.logo}
          className="size-6 rounded-full"
          alt={token.symbol}
        />
      ),
    };
  });
};
