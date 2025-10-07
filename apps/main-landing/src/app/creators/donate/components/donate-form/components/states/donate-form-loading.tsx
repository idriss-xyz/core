import { TxLoadingContent } from '@idriss-xyz/ui/tx-loading-modal';
import { classes } from '@idriss-xyz/ui/utils';
import { formatFiatValue } from '@idriss-xyz/utils';

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white px-4 pb-9 pt-6 flex flex-col items-center relative';

type Properties = {
  className?: string;
  activeTab: 'token' | 'collectible';
  selectedCollectible: { name: string } | null;
  amount?: number;
  collectibleAmount?: number;
  amountInSelectedToken?: string;
  selectedTokenSymbol?: string;
};

export function DonateFormLoading({
  className,
  activeTab,
  selectedCollectible,
  amount,
  collectibleAmount,
  amountInSelectedToken,
  selectedTokenSymbol,
}: Properties) {
  return (
    <div className={classes(baseClassName, className)}>
      <TxLoadingContent
        heading={
          <>
            Sending{' '}
            <span className={classes('text-mint-600')}>
              {activeTab === 'collectible' && selectedCollectible
                ? selectedCollectible.name
                : formatFiatValue(amount!)}
            </span>{' '}
            {activeTab === 'collectible' &&
            collectibleAmount &&
            collectibleAmount > 1
              ? `(${collectibleAmount}x)`
              : null}
            {amountInSelectedToken
              ? ` (${amountInSelectedToken} ${selectedTokenSymbol})`
              : null}
          </>
        }
        confirmationMessage="Confirm transfer in your wallet"
      />
    </div>
  );
}
