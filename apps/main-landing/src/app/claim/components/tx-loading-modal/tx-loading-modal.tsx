import { Spinner } from '@idriss-xyz/ui/spinner';
import { classes } from '@idriss-xyz/ui/utils';
import { ReactNode } from 'react';

interface Properties {
  show: boolean;
  heading: ReactNode;
  className?: string;
}

export const TxLoadingModal = ({
  show,
  heading,
  className,
}: Properties) => {
  if (!show) return null;
  return (
    <div className="bg-black/50 absolute inset-0 z-[10] h-screen w-screen">
      <div
        className={classes(
          'w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
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
    </div>  );
};
