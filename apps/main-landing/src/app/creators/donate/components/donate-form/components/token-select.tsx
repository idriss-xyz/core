import { useMemo, ReactNode } from 'react';
import { Token } from '@idriss-xyz/constants';

import { Select } from './select';

interface Properties {
  value: string;
  label?: string;
  tokens: Token[];
  className?: string;
  onChange: (value: string) => void;
  renderRight?: () => ReactNode;
}

export const TokenSelect = ({
  value,
  label,
  tokens,
  onChange,
  className,
  renderRight,
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
      renderRight={renderRight}
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
        <img
          src={token.logo}
          alt={token.symbol}
          className="size-6 rounded-full"
        />
      ),
    };
  });
};
