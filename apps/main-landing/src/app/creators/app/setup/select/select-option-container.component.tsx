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
        ref={reference}
        {...restProperties}
        className={classes(
          'w-full rounded-xl border bg-white shadow-lg focus:outline-none',
          className,
        )}
      />
    );
  },
);

SelectOptionContainer.displayName = 'SelectOptionContainer';
