import { ButtonHTMLAttributes } from 'react';

import { classes } from '../../utils';

import { button, ButtonVariants } from './variants';
import { Glow } from './glow';

type Properties = ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants;

// TODO: probably we need isomorphic component so button can be used as <a> element which accepts 'href' attribute, consider doing it with forwardRef
export const Button = ({
  children,
  className,
  intent,
  size,
  ...properties
}: Properties) => {
  return (
    <button
      {...properties}
      className={classes(button({ intent, size, className }))}
    >
      {children}
      <Glow intent={intent} size={size} />
    </button>
  );
};
