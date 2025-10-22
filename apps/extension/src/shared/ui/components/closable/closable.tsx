import { ReactNode } from 'react';

import { classes } from '../../utils';
import { IconButton } from '../icon-button';

type Properties = {
  children: ReactNode;
  className?: string;
  hideCloseButton?: boolean;
  closeButtonClassName?: string;
  closeButtonIconClassName?: string;
  closeOnClickAway?: boolean;
  closeOnHoverAway?: boolean;
  onClose?: () => void;
  onClickInside?: () => void;
};

export const Closable = ({
  children,
  className,
  onClose,
  hideCloseButton = false,
  closeButtonClassName,
  closeButtonIconClassName,
  onClickInside,
}: Properties) => {
  return (
    <>
      <div
        className={classes('relative p-5 shadow-lg', className)}
        onClick={onClickInside}
      >
        {children}
        {hideCloseButton ? null : (
          <IconButton
            onClick={onClose}
            className={classes(
              'absolute right-1 top-1 flex items-center justify-center bg-transparent p-0.5',
              closeButtonClassName,
            )}
            iconProps={{
              name: 'Cross2Icon',
              size: 16,
              className: classes('text-[#aaa]', closeButtonIconClassName),
            }}
          />
        )}
      </div>
    </>
  );
};
