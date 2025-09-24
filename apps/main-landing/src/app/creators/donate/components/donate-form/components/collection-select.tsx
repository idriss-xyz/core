import { useMemo, ReactNode } from 'react';
import { Hex } from 'viem';
import { CollectionOption } from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

import { Select } from './select/select.component';

interface Properties {
  value: Hex;
  label?: string;
  collections: CollectionOption[];
  onChange: (value: Hex) => void;
  className?: string;
  renderRight?: () => ReactNode;
  renderLeft?: () => ReactNode;
}

export const CollectionSelect = ({
  value,
  collections,
  onChange,
  label,
  className,
  renderRight,
  renderLeft,
}: Properties) => {
  const options = useMemo(() => {
    return collections.map((c) => {
      return {
        value: c.address,
        label: c.name,
        prefix: <img src={c.image} className="size-6 rounded" alt="" />,
        suffix: (
          <div className="flex items-center gap-1">
            <Icon name="Layers" className="size-4 text-neutral-600" />
            <span className={classes('text-label6 text-neutral-600')}>
              {c.itemsCount}
            </span>
          </div>
        ),
      };
    });
  }, [collections]);

  const selected = collections.find((c) => {
    return c.address === value;
  });

  const autoRenderLeft =
    renderLeft ??
    (selected
      ? () => {
          return <img src={selected.image} className="size-6 rounded" alt="" />;
        }
      : undefined);

  return (
    <Select
      label={label}
      value={value}
      options={options}
      onChange={onChange}
      className={className}
      renderRight={renderRight}
      renderLeft={autoRenderLeft}
    />
  );
};
