import { AnchorHTMLAttributes } from 'react';

import { classes } from '../../utils';

import { link, LinkVariants } from './variants';

type Properties = LinkVariants & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = ({
  children,
  size,
  className,
  ...properties
}: Properties) => {
  const variantClassName = classes(
    link({
      size,
      className,
    }),
  );

  return (
    <a {...properties} className={variantClassName}>
      {children}
    </a>
  );
};
