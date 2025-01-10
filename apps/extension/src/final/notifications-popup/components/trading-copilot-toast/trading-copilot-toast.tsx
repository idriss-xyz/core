import { Button } from '@idriss-xyz/ui/button';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { isAddress } from 'viem';

import { Icon, PreloadedImage } from 'shared/ui';
import { getShortWalletHex, TimeDifferenceCounter } from 'shared/utils';
import { roundToSignificantFigures } from 'shared/web3';

import { Properties } from './trading-copilot-toast.types';

export const TradingCopilotToast = ({
  toast,
  ensName,
  avatarImage,
  openDialog,
}: Properties) => {
  const userName = ensName ?? toast.from;

  return (
    <div className="grid grid-cols-[48px,1fr] gap-2">
      <PreloadedImage
        avatarImage={avatarImage}
        className="size-12 rounded-full border border-neutral-400 bg-neutral-200"
        fallbackComponent={
          <div className="flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
            <Icon size={30} name="PersonIcon" className="text-neutral-500" />
          </div>
        }
      />
      <div className="flex w-full flex-col gap-y-1">
        <p className="break-all text-label3 text-neutral-900">
          {isAddress(userName) ? getShortWalletHex(userName) : userName}{' '}
          <span className="inline-flex items-center gap-x-1 text-body3 text-neutral-600">
            got{' '}
            <span className="inline-flex items-center justify-center gap-x-1">
              <IdrissIcon name="IdrissToken" size={24} className="size-6" />
              <span>
                {roundToSignificantFigures(toast.tokenIn.amount, 2)}{' '}
                {toast.tokenIn.symbol}
              </span>
            </span>
          </span>
        </p>
        <div className="flex w-full justify-between">
          <p className="text-body6 text-mint-700">
            <TimeDifferenceCounter timestamp={toast.timestamp} text="ago" />
          </p>
          <Button
            intent="primary"
            size="small"
            className="uppercase"
            onClick={() => {
              openDialog(toast);
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};
