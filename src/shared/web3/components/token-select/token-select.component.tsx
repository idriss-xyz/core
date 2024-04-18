import { useMemo } from 'react';

import { Select } from 'shared/ui/components';

import { ChainSelectProperties } from './token-select.types';
import { getOptions } from './token-select.library';

export const ChainSelect = ({
  value,
  label,
  onChange,
  className,
  allowedChainsIds,
  renderSuffix,
}: ChainSelectProperties) => {
  const options = useMemo(() => {
    return getOptions(allowedChainsIds, renderSuffix);
  }, [allowedChainsIds, renderSuffix]);

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
