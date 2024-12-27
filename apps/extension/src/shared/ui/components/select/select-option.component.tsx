import { ForwardedRef, forwardRef } from 'react';

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
          'flex w-full cursor-pointer items-center space-x-2 rounded-xl border-r border-none border-r-neutral-200 px-3 py-2 text-left',
          'hover:bg-black/10 focus:bg-black/50',
          className,
        )}
      >
        <div className={classes('relative mr-1 pr-2', selectedClassName)}>
          {option.prefix}
        </div>
        <div className="whitespace-nowrap text-neutralGreen-900">
          {option.label}
        </div>
        {option.suffix}
      </div>
    );
  },
);

SelectOption.displayName = 'SelectOption';
