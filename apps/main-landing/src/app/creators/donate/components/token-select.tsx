import { useMemo } from 'react';
import { Token } from '@idriss-xyz/constants';

import { Select } from './select';

interface Properties {
  value: string;
  label?: string;
  className?: string;
  tokens: Token[];
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

const optionsFrom = (tokens: Token[]) => {
  return tokens.map((token) => {
    return {
      label: token.name,
      value: token.symbol,
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
