import { ForwardedRef, forwardRef } from 'react';

import { classes } from 'shared/ui/utils';

import { SelectOptionProperties } from './select.types';

export const SelectOption = forwardRef(
  (
    { option, className }: SelectOptionProperties<unknown>,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={reference}
        className={classes(
          'flex w-full cursor-pointer items-center space-x-2 border-none px-3 py-2 text-left',
          'hover:bg-black/10 focus:bg-black/50',
          className
        )}
      >
        {option.prefix}
        <div className="whitespace-nowrap">{option.label}</div>
        {option.suffix}
      </div>
    );
  },
);

SelectOption.displayName = 'SelectOption';
