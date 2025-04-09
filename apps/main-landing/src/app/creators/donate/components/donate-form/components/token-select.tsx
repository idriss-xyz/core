import { useMemo } from 'react';
import { Token } from '@idriss-xyz/constants';

import { Select } from './select';

interface Properties {
  value: string;
  label?: string;
  tokens: Token[];
  className?: string;
  onChange: (value: string) => void;
}

export const TokenSelect = ({
  value,
  label,
  tokens,
  onChange,
  className,
}: Properties) => {
  const options = useMemo(() => {
    return optionsFrom(tokens);
  }, [tokens]);

  return (
    <Select
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={className}
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
          alt={token.symbol}
          className="size-6 rounded-full"
        />
      ),
    };
  });
};
