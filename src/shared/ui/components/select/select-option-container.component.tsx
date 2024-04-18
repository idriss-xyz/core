import { ReactNode, forwardRef } from 'react';

import { classes } from 'shared/ui/utils';
import { PolymorphicReference } from 'shared/ui/types';

import {
  PolymorphicSelectOptionContainerProperties,
  SelectOptionContainerComponent,
} from './select.types';

export const SelectOptionContainer: SelectOptionContainerComponent = forwardRef(
  <Element extends React.ElementType>(
    {
      as,
      className,
      ...restProperties
    }: PolymorphicSelectOptionContainerProperties<Element>,
    reference: PolymorphicReference<Element>,
  ): ReactNode => {
    const Component = as ?? 'div';

    return (
      <Component
        {...restProperties}
        className={classes(
          'w-full rounded-md bg-white shadow-sm ring-1 ring-gray-300 focus:outline-none focus:ring-indigo-500',
          className,
        )}
        ref={reference}
      />
    );
  },
) as SelectOptionContainerComponent;

SelectOptionContainer.displayName = 'SelectOptionContainer';
