import { classes } from 'shared/ui/utils';

import { IdrissMoneyButtonProperties } from './idriss-money-input.types';

export const IdrissMoneyButton = ({
  children,
  onClick,
  isActive,
  className,
}: IdrissMoneyButtonProperties) => {
  return (
    <button
      className={classes(
        'flex items-center justify-center rounded-md bg-green-100 px-4 py-2 text-base font-medium shadow-sm hover:bg-idriss-primary-400',
        isActive && 'bg-idriss-primary-400',
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
