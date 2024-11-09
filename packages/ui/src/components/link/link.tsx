import { AnchorHTMLAttributes, ForwardedRef, forwardRef } from 'react';

import { classes } from '../../utils';
import { ExternalLink } from '../external-link';

import { link, LinkVariants } from './variants';

type Properties = LinkVariants &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    isExternal?: boolean;
  };

export const Link = forwardRef(
  (
    { children, size, className, isExternal, ...properties }: Properties,
    reference: ForwardedRef<HTMLAnchorElement>,
  ) => {
    const variantClassName = classes(
      link({
        size,
        className,
      }),
    );

    const Component = isExternal ? ExternalLink : 'a';

    return (
      <Component {...properties} ref={reference} className={variantClassName}>
        {children}
      </Component>
    );
  },
);

Link.displayName = 'Link';
