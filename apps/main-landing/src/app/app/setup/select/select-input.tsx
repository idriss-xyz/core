import { ForwardedRef, forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import SelectIcon from '@/app/donate/components/donate-form/components/select/select-icon';

import { SelectInputProperties } from './select.types';

export const SelectInput = forwardRef(
  (
    {
      className,
      placeholder,
      value,
      selected,
    }: Omit<SelectInputProperties, 'iconName'>,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={reference}
        className={classes(
          'flex h-full w-full cursor-pointer items-center justify-between text-left',
          className,
        )}
      >
        <div className="flex-1">
          {selected ? (
            <span className="text-body4 text-neutral-900">{value}</span>
          ) : (
            <span className="text-body4 text-neutral-600">
              {placeholder ?? 'Select an option'}
            </span>
          )}
        </div>
        <SelectIcon />
      </div>
    );
  },
);

SelectInput.displayName = 'SelectInput';
