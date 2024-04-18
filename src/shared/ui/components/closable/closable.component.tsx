import { classes } from 'shared/ui/utils';

import { IconButton } from '../icon-button';

import { ClosableProperties } from './closable.types';

// TODO: make it polymorhpic
export const Closable = ({
  top,
  left,
  children,
  className,
  onClose,
  closeButtonClassName,
  closeButtonIconClassName,
  closeOnClickAway = false,
}: ClosableProperties) => {
  return (
    <>
      {closeOnClickAway && (
        <div className="fixed inset-0 bg-transparent" onClick={onClose} />
      )}
      <div
        className={classes('p-5 shadow-lg', className)}
        style={{
          top, // TODO: style won't be needed but need to write scoped css variable and read it from tailwind
          left,
        }}
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
