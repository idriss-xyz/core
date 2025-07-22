import { ForwardedRef, forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import SelectIcon from '@/app/creators/donate/components/donate-form/components/select/select-icon';

import { SelectOptionProperties } from './select.types';

export const SelectOption = forwardRef(
  (
    { option, className, selected }: SelectOptionProperties<unknown>,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    const selectedClassName = selected
      ? 'after:absolute after:-top-1.5 after:right-0 after:h-[calc(2.625rem_-_6px)] after:w-px after:bg-gray-200'
      : '';

    return (
      <div
        ref={reference}
        className={classes(
          'flex w-full cursor-pointer items-center border-none text-left',
          className,
        )}
        onClick={option.onClick}
      >
        <div
          className={classes(
            'relative',
            selectedClassName,
            option.prefix && 'pr-3',
          )}
        >
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
