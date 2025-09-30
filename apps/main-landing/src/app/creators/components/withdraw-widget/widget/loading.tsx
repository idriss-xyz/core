import { Spinner } from '@idriss-xyz/ui/spinner';
import { classes } from '@idriss-xyz/ui/utils';
import { getShortWalletHex } from '@idriss-xyz/utils';
import { ReactNode } from 'react';

interface Properties {
  heading: ReactNode;
  children?: ReactNode;
  recipient?: string;
  className?: string;
}

export const Loading = ({
  recipient,
  heading,
  children,
  className,
}: Properties) => {
  return (
    <div
      className={classes('flex flex-col items-center text-center', className)}
    >
      <Spinner className={classes('size-16 text-mint-600')} />
      <p
        className={classes(
          'mt-6 text-heading5 text-neutral-900 lg:text-heading4',
        )}
      >
        Waiting for confirmation
      </p>
      <p
        className={classes(
          'mt-3 flex flex-wrap justify-center gap-1 text-body5 text-neutral-600 lg:text-body4',
        )}
      >
        {heading}
        {recipient ? (
          <>
            <span>to </span>
            <span
              className="block max-w-40 truncate whitespace-nowrap"
              title={recipient}
            >
              {getShortWalletHex(recipient)}
            </span>
          </>
        ) : null}
      </p>
      {children ? (
        <p
          className={classes('mt-1 text-body5 text-neutral-600 lg:text-body4')}
        >
          {' '}
          {children}
        </p>
      ) : null}
    </div>
  );
};
