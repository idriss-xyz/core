import { ForwardedRef, forwardRef, HTMLProps } from 'react';

import { classes } from '../../utils';

import { badge, BadgeVariants } from './variants';

type Properties = BadgeVariants & HTMLProps<HTMLSpanElement>;

export const Badge = forwardRef(
  (
    { children, type, variant, className, ...properties }: Properties,
    reference: ForwardedRef<HTMLSpanElement>,
  ) => {
    const variantClassName = classes(badge({ type, variant }), className);

    const Component = 'span';

    return (
      <Component {...properties} ref={reference} className={variantClassName}>
        {children}
      </Component>
    );
  },
);

Badge.displayName = 'Badge';
