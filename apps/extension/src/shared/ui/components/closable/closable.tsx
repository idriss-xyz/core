import { ReactNode } from 'react';

import { classes } from '../../utils';
import { IconButton } from '../icon-button';
import { Backdrop } from '../backdrop';

interface Properties {
  children: ReactNode;
  className?: string;
  closeButtonClassName?: string;
  closeButtonIconClassName?: string;
  closeOnClickAway?: boolean;
  closeOnHoverAway?: boolean;
  onClose?: () => void;
  onClickInside?: () => void;
}

export const Closable = ({
  children,
  className,
  onClose,
  closeButtonClassName,
  closeButtonIconClassName,
  onClickInside,
  closeOnClickAway = false,
  closeOnHoverAway = false,
}: Properties) => {
  const shouldRenderBackdrop = closeOnClickAway || closeOnHoverAway;

  return (
    <>
      {shouldRenderBackdrop && (
        <Backdrop
          onClick={closeOnClickAway ? onClose : undefined}
          onHover={closeOnHoverAway ? onClose : undefined}
          hoverActionDelay={1500}
        />
      )}
      <div
        className={classes('relative p-5 shadow-lg', className)}
        onClick={onClickInside}
      >
        {children}
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
      </div>
    </>
  );
};
