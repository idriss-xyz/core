import { classes } from '../../utils';

import { ChipProperties } from './chip.types';

// TODO: compound component
export const Chip = ({
  children,
  className,
  width = 'short',
  variant = 'success',
  onClick,
}: ChipProperties) => {
  return (
    <div
      className={classes(
        'rounded-full px-3 py-0.5 text-xs',
        width === 'short' && 'px-3',
        width === 'long' && 'px-6',
        variant === 'success' && 'bg-[#21B66F] text-white',
        variant === 'info' && 'bg-white text-[#1c1b20]',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
