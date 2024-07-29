import { useCallback, useState } from 'react';

import { classes } from '../../utils';
import { Closable } from '../closable';

import { WidgetBaseProperties } from './widget-base.types';

export const WidgetBase = ({
  top,
  onClose,
  children,
  className,
  closeButtonClassName,
}: WidgetBaseProperties) => {
  const [isVisible, setIsVisible] = useState(true);

  const close = useCallback(() => {
    onClose?.();
    setIsVisible(false);
  }, [onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <Closable
      top={top}
      onClose={close}
      className={classes('right-4 z-10 w-96 text-white', className)}
      closeButtonClassName={closeButtonClassName}
    >
      {children}
    </Closable>
  );
};
