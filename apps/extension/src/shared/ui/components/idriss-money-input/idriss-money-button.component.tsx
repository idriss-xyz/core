import { classes } from '../../utils';

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
        'flex items-center justify-center rounded-md bg-[#DCFCE7] px-4 py-2 text-base font-medium shadow-sm hover:bg-[#11DD74]',
        isActive && 'bg-[#11DD74]',
        className,
      )}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
