import { ForwardedRef, forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { SelectOptionProperties } from './select.types';

import SelectIcon from '@/app/donate/components/donate-form/components/select/select-icon';


export const SelectOption = forwardRef(
  (
    { option, className, selected }: SelectOptionProperties<unknown>,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={reference}
        className={classes(
          'flex w-full cursor-pointer items-center border-none text-left',
          className,
        )}
        onClick={option.onClick}
      >
        <div className={classes('relative', option.prefix && 'pr-3')}>
          {option.prefix}
        </div>
        {option.renderLabel ? (
          option.renderLabel()
        ) : (
          <div className="flex-1 whitespace-nowrap text-neutralGreen-900">
            {option.label}
          </div>
        )}

        {option.suffix}

        <div className="items-center">{selected ? <SelectIcon /> : ''}</div>
      </div>
    );
  },
);

SelectOption.displayName = 'SelectOption';
