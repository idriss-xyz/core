import { ForwardedRef, ReactNode, forwardRef } from 'react';
import { classes } from '@idriss-xyz/ui/utils';

import { SelectOptionContainerProperties } from './select.types';

export const SelectOptionContainer = forwardRef(
  (
    { className, ...restProperties }: SelectOptionContainerProperties,
    reference: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    return (
      <div
        {...restProperties}
        className={classes(
          'w-full rounded-md bg-white shadow-sm focus:outline-none',
          className,
        )}
        ref={reference}
      />
    );
  },
);

SelectOptionContainer.displayName = 'SelectOptionContainer';
