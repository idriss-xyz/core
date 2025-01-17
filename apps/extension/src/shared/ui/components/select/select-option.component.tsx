import { ForwardedRef, forwardRef } from 'react';

import { SelectIcon } from 'shared/ui/utils/select-icon';

import { classes } from '../../utils';

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
          'flex w-full cursor-pointer items-center space-x-3 py-2 ps-3 text-left',
          'hover:bg-black/10 focus:bg-black/50',
          className,
          selected ? 'rounded-xl border border-neutral-200' : '',
        )}
      >
        <div className={classes('relative pr-3', selectedClassName)}>
          {option.prefix}
        </div>
        <div className="flex-1 whitespace-nowrap text-neutralGreen-900">
          {option.label}
        </div>
        {option.suffix}
        <div className="items-center">{selected ? <SelectIcon /> : ''}</div>
      </div>
    );
  },
);

SelectOption.displayName = 'SelectOption';
