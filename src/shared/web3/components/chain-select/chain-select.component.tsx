import { useMemo } from 'react';

import { Select } from 'shared/ui/components';

import { ChainSelectProperties } from './chain-select.types';
import { getOptions } from './chain-select.library';

export const ChainSelect = ({
  value,
  label,
  onChange,
  className,
  allowedChainsIds,
  renderSuffix,
  renderLabel,
}: ChainSelectProperties) => {
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
