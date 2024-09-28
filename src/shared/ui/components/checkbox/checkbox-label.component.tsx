import { ReactNode } from 'react';

import { classes } from 'shared/ui/utils';

type Properties = {
  children: ReactNode;
  className?: string;
};

export const CheckboxLabel = ({ children, className }: Properties) => {
  return (
    <span className={classes('text-sm leading-none', className)}>
      {children}
    </span>
  );
};
