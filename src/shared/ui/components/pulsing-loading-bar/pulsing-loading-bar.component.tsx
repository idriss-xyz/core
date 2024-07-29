import { classes } from '../../utils';

import { PulsingLoadingBarProperties } from './pulsing-loading-bar.types';

export const PulsingLoadingBar = ({
  isLoading,
}: PulsingLoadingBarProperties) => {
  return (
    <div
      className={classes(
        'absolute top-0 h-1 animate-pulse rounded-t-lg bg-gradient-to-r from-stone-300 via-stone-500 to-stone-300  delay-75 duration-200',
        isLoading ? 'left-0 w-full' : 'right-0 w-0',
      )}
    />
  );
};
