import { ReactNode, useMemo, useState } from 'react';
import * as Portal from '@radix-ui/react-portal';

import { usePortal } from '../../providers/with-portal';
import { IconButton } from '../icon-button';
import { classes } from '../../utils';

import { Backdrop } from './backdrop';

type Properties = {
  header?: ReactNode;
  children: ReactNode;
  isOpened: boolean;
  onClose: () => void;
  className?: string;
  backdropClassName?: string;
  closeOnHoverAway?: boolean;
  closeOnClickAway?: boolean;
  onClickInside?: () => void;
  width?: number;
  left?: number;
  right?: number;
  top?: number;
  headerContainerClassName?: string;
  withoutPortal?: boolean;
};

export const Modal = ({
  children,
  header,
  isOpened,
  onClose,
  className,
  backdropClassName,
  closeOnHoverAway,
  closeOnClickAway,
  onClickInside,
  headerContainerClassName,
  width,
  left,
  right,
  top,
  withoutPortal,
}: Properties) => {
  const [fakePortal, setFakePortal] = useState<HTMLDivElement | null>(null);
  const { portal } = usePortal();

  const shouldBeCentered = useMemo(() => {
    return [left, right, top].every((value) => {
      return value === undefined;
    });
  }, [left, right, top]);

  if (!isOpened) {
    return null;
  }

  return (
    <div ref={setFakePortal}>
      <Portal.Root container={withoutPortal ? fakePortal : portal}>
        <Backdrop
          className={classes(
            'fixed inset-0 z-portal bg-neutral-400/60',
            backdropClassName,
          )}
          onClick={closeOnClickAway ? onClose : undefined}
          onHover={closeOnHoverAway ? onClose : undefined}
          hoverActionDelay={1500}
        />
        <div
          className={classes(
            'z-portal rounded-xl bg-white shadow-2xl',
            shouldBeCentered
              ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
              : 'absolute',
            className,
          )}
          style={{
            width,
            left,
            right,
            top,
          }}
          onClick={onClickInside}
        >
          {/* pr-8 at end on purpose so header never overflows icon */}
          {header && (
            <div
              className={classes(
                'relative',
                headerContainerClassName,
                'pr-14',
                'border-b-secondary border-b',
              )}
            >
              {header}
              <IconButton
                onClick={onClose}
                className="absolute right-3 top-3"
                intent="tertiary"
                size="medium"
                iconName="X"
              />
            </div>
          )}
          {children}
        </div>
      </Portal.Root>
    </div>
  );
};
