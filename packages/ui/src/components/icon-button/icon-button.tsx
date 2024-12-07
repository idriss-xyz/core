import { ComponentProps, forwardRef } from 'react';

import { Button, BUTTON_SIZE_TO_ICON_SIZE } from '../button';
import { classes } from '../../utils';
import { Icon, IconName } from '../icon';

import { iconButton, IconButtonVariants } from './variants';

type Properties = {
  iconName: IconName;
} & ComponentProps<typeof Button> &
  IconButtonVariants;

export const IconButton = forwardRef(
  ({ iconName, className, size, ...properties }: Properties, reference) => {
    return (
      <Button
        {...properties}
        ref={reference}
        size={size}
        className={classes(iconButton({ className, size }))}
      >
        <Icon name={iconName} size={BUTTON_SIZE_TO_ICON_SIZE[size]} />
      </Button>
    );
  },
);

IconButton.displayName = 'IconButton';
