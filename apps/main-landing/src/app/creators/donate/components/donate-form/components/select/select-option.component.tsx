import { ForwardedRef, forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import SelectIcon from '@/app/creators/donate/components/donate-form/components/select/select-icon';

import { SelectOptionProperties } from './select.types';

export const SelectOption = forwardRef(
  (
    {
      option,
      className,
      selected,
      disableHover,
      hideSuffix,
    }: SelectOptionProperties<unknown>,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    const selectedClassName = selected
      ? 'after:absolute after:-top-1.5 after:right-0 after:h-[calc(2.625rem_-_6px)] after:w-px after:bg-gray-200'
      : '';

    return (
      <div
        ref={reference}
        className={classes(
          'flex w-full cursor-pointer items-center space-x-3 py-[9px] ps-3 text-left',
          !disableHover && 'hover:bg-black/10 focus:bg-black/50',
          className,
        )}
      >
        <div className={classes('relative pr-3', selectedClassName)}>
          {option.prefix}
        </div>

        <div className="flex-1 whitespace-nowrap text-neutralGreen-900">
          {option.label}
        </div>

        {!hideSuffix && option.suffix && (
          <div className="flex items-center rounded-[4px] bg-neutral-200 px-1 py-0.5">
            {option.suffix}
          </div>
        )}

        <div className="items-center">{selected ? <SelectIcon /> : ''}</div>
      </div>
    );
  },
);

SelectOption.displayName = 'SelectOption';
