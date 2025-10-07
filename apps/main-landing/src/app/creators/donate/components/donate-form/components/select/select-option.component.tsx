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
      hidePrefix,
    }: SelectOptionProperties<unknown>,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <div
        ref={reference}
        className={classes(
          'flex w-full cursor-pointer items-center py-[9px] ps-3 text-left',
          !disableHover && 'hover:bg-black/10 focus:bg-black/50',
          className,
        )}
      >
        {!hidePrefix && <div className="relative pr-3">{option.prefix}</div>}

        <div className="min-w-0 flex-1 truncate text-neutralGreen-900">
          {option.label}
        </div>

        {!hideSuffix && option.suffix && (
          <div className="ml-3 flex items-center rounded-[4px] bg-neutral-200 px-1 py-0.5">
            {option.suffix}
          </div>
        )}

        <div className="ml-auto flex items-center">
          {selected ? <SelectIcon /> : ''}
        </div>
      </div>
    );
  },
);

SelectOption.displayName = 'SelectOption';
