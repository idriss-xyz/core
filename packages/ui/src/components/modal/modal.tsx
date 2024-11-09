import { ReactNode } from 'react';
import * as Portal from '@radix-ui/react-portal';

import { usePortal } from '../../providers/with-portal';
import { IconButton } from '../icon-button';
import { classes } from '../../utils';

type Properties = {
  header: ReactNode;
  children: ReactNode;
  isOpened: boolean;
  onClose: () => void;
  className?: string;
};

export const Modal = ({
  children,
  header,
  isOpened,
  onClose,
  className,
}: Properties) => {
  const { portal } = usePortal();

  if (!isOpened) {
    return null;
  }

  return (
    <Portal.Root container={portal}>
      <div className="fixed inset-0 bg-neutral-400/60" onClick={onClose} />
      <div
        className={classes(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4',
          className,
        )}
      >
        <div>{header}</div>
        <div className="mt-6">{children}</div>
        <IconButton
          onClick={onClose}
          className="absolute right-3 top-3"
          intent="tertiary"
          size="medium"
          iconName="X"
        />
      </div>
    </Portal.Root>
  );
};
