import { forwardRef } from 'react';

import { Button, ButtonProperties, Icon, classes } from 'shared/ui';

export const UnavailableButton = forwardRef<
  HTMLButtonElement,
  Pick<ButtonProperties, 'className'>
>(({ className }, reference) => {
  return (
    <Button
      title="Trading is not available to people or companies who are residents of, or are located, incorporated or have a registered agent in, the United States or a restricted territory. See our Terms of Use."
      ref={reference}
      className={classes(
        'relative w-full cursor-not-allowed rounded-lg bg-red-200 text-red-400',
        className,
      )}
      disabled
    >
      <Icon name="GlobeIcon" />
      <span className="ml-2">Unavailable</span>
    </Button>
  );
});

UnavailableButton.displayName = 'UnavailableButton';
