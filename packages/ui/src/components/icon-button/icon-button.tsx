import { ComponentProps, ReactNode } from 'react';

import { Button } from '../button';
import { classes } from '../../utils';

import { iconButton, IconButtonVariants } from './variants';

type Properties = {
  icon: ReactNode;
} & ComponentProps<typeof Button> &
  IconButtonVariants;

export const IconButton = ({
  icon,
  className,
  size,
  ...properties
}: Properties) => {
  return (
    <Button
      {...properties}
      size={size}
      className={classes(iconButton({ className, size }))}
    >
      {icon}
    </Button>
  );
};
