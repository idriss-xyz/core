import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Spinner } from '../spinner';
import { classes } from '../../utils';

interface Properties {
  show: boolean;
  heading: ReactNode;
  className?: string;
}

export const TxLoadingModal = ({ show, heading, className }: Properties) => {
  if (!show) return null;

  return createPortal(
    <div className="absolute inset-0 z-[15] bg-black/50">
      <div
        className={classes(
          'absolute left-1/2 top-1/2 flex w-[440px] max-w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl bg-white px-4 pb-9 pt-6 text-center',
          className,
        )}
      >
        <Spinner className="size-16 text-mint-600" />
        <p className="mt-6 text-heading5 text-neutral-900 lg:text-heading4">
          Waiting for confirmation
        </p>
        <p className="mt-3 flex flex-wrap justify-center gap-1 text-body5 text-neutral-600 lg:text-body4">
          {heading}
        </p>
        <p className="mt-1 text-body5 text-neutral-600 lg:text-body4">
          Confirm transaction in your wallet
        </p>
      </div>
    </div>,
    document.body,
  );
};
