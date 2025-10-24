import { useMemo, ReactNode } from 'react';
import { NftOption } from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

import { Select } from './select';

interface Properties {
  value: string;
  items: NftOption[];
  onChange: (tokenId: string) => void;
  label?: string;
  className?: string;
  renderRight?: () => ReactNode;
  renderLeft?: () => ReactNode;
}

export const ItemSelect = ({
  value,
  label,
  items,
  onChange,
  className,
  renderRight,
  renderLeft,
}: Properties) => {
  const options = useMemo(() => {
    return items.map((it) => {
      return {
        value: it.tokenId,
        label: it.name,
        prefix: <img src={it.image} className="size-6 rounded" alt="" />,
        suffix: (
          <div className="flex items-center gap-1">
            <Icon name="Layers" className="size-4 text-neutral-600" />
            <span className={classes('text-label6 text-neutral-600')}>
              {Number(it.balance)}
            </span>
          </div>
        ),
      };
    });
  }, [items]);

  const selected = items.find((index) => {
    return index.tokenId === value;
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
