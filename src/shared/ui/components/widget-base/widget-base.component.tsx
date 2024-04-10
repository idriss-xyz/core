import { useCallback, useState } from 'react';

import { classes } from 'shared/ui/utils';

import { IconButton } from '../icon-button';

import { WidgetBaseProperties } from './widget-base.types';

// TODO: make it polymorhpic
export const WidgetBase = ({
  children,
  className,
  onHide,
  top,
  closeButtonClassName,
}: WidgetBaseProperties) => {
  const [isVisible, setIsVisible] = useState(true);

  const hide = useCallback(() => {
    onHide?.();
    setIsVisible(false);
  }, [onHide]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={classes('right-4 w-96 p-5 text-white shadow-lg', className)}
      style={{
        top, // TODO: style won't be needed but need to write scoped css variable and read it from tailwind
      }}
    >
      {children}
      <IconButton
        onClick={hide}
        className={classes(
          'absolute right-1 top-1 flex items-center justify-center bg-transparent p-0.5',
          closeButtonClassName,
        )}
        iconProps={{
          name: 'Cross2Icon',
          size: 16,
          className: 'text-[#aaa]',
        }}
      />
    </div>
  );
};
