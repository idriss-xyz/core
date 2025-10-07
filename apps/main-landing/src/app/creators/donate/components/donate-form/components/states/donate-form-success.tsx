import { Icon } from '@idriss-xyz/ui/icon';
import { Link } from '@idriss-xyz/ui/link';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';
import { getTransactionUrl } from '@idriss-xyz/utils';
import { EMPTY_HEX } from '@idriss-xyz/constants';
import { Hex } from 'viem';

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center relative';

type Properties = {
  className?: string;
  chainId: number;
  transactionHash?: Hex;
  resetForm: () => void;
};

export function DonateFormSuccess({
  className,
  chainId,
  transactionHash,
  resetForm,
}: Properties) {
  const transactionUrl = getTransactionUrl({
    chainId,
    transactionHash: transactionHash ?? EMPTY_HEX,
  });

  return (
    <div className={classes(baseClassName, className)}>
      <div className={classes('rounded-[100%] bg-mint-200 p-4')}>
        <Icon
          size={48}
          name="CheckCircle2"
          className={classes('stroke-1 text-mint-600')}
        />
      </div>

      <p className={classes('text-heading4 text-neutral-900')}>
        Transfer completed
      </p>

      <Link
        isExternal
        size="medium"
        href={transactionUrl}
        className="mt-2 flex items-center"
      >
        View on explorer
      </Link>

      <Button
        size="medium"
        intent="negative"
        className="mt-6 w-full"
        onClick={resetForm}
      >
        CLOSE
      </Button>
    </div>
  );
}
