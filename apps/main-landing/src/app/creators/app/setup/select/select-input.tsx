import { ForwardedRef, forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import SelectIcon from '@/app/creators/donate/components/donate-form/components/select/select-icon';

import {SelectInputProperties} from './select.types';

export const SelectInput = forwardRef(
  (
    { className, selected }: SelectInputProperties,
    reference: ForwardedRef<HTMLDivElement>,
  ) => {

    return (
      <div
        ref={reference}
        className={classes(
          'flex h-[44px] w-full cursor-pointer items-center space-x-3 border-none text-left',
          'hover:bg-black/10 focus:bg-black/50',
          className,
        )}
      >
        <div className="flex-1 py-2 px-3">
          <span className="text-body4 text-neutral-600">Cash register</span>
        </div>


        <div className="items-center">{selected ? <SelectIcon /> : ''}</div>
        <div className="flex h-full w-[40px] items-center border-l border-l-gray-200 px-3">
          <IconButton iconName="PlayCircle" size="small" intent="tertiary" />
        </div>
      </div>
    );
  },
);

SelectInput.displayName = 'SelectInput';
