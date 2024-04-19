import { useMemo } from 'react';

import { Select } from 'shared/ui/components';

import { TokenSelectProperties } from './token-select.types';
import { getOptions } from './token-select.library';

export const TokenSelect = ({
  value,
  label,
  onChange,
  className,
}: TokenSelectProperties) => {
  const options = useMemo(() => {
    return getOptions();
  }, []);

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
