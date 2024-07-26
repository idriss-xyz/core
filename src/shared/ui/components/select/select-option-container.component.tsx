import { ReactNode, forwardRef } from 'react';

import { PolymorphicReference } from '../../types';
import { classes } from '../../utils';

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
          'w-full rounded-md bg-white shadow-sm focus:outline-none',
          className,
        )}
        ref={reference}
      />
    );
  },
) as SelectOptionContainerComponent;

SelectOptionContainer.displayName = 'SelectOptionContainer';
