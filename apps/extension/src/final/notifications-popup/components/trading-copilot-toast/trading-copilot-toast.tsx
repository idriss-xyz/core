import {Button} from '@idriss-xyz/ui/button';
import {isAddress} from 'viem';

import {Icon, PreloadedImage} from 'shared/ui';
import {getShortWalletHex, TimeDifferenceCounter} from 'shared/utils';
import {
  getWholeNumber,
  formatBigNumber,
  roundToSignificantFiguresForCopilotTrading,
} from 'shared/web3';

import {TokenIcon} from '../../utils';
import {TradingCopilotTooltip} from '../trading-copilot-tooltip';

import {Properties} from './trading-copilot-toast.types';

export const TradingCopilotToast = ({
                                      toast,
                                      ensName,
                                      avatarImage,
                                      openDialog,
                                    }: Properties) => {
  const userName = ensName ?? toast.from;

  const {value: roundedNumber, index: zerosIndex} =
    roundToSignificantFiguresForCopilotTrading(toast.tokenIn.amount, 2);

  console.log(toast.tokenIn)

  return (
    <div className="grid grid-cols-[48px,1fr] gap-2">
      <PreloadedImage
        avatarImage={avatarImage}
        className="size-12 rounded-full border border-neutral-400 bg-neutral-200"
        fallbackComponent={
          <div
            className="flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
            <Icon size={30} name="PersonIcon" className="text-neutral-500"/>
          </div>
        }
      />
      <div className="flex w-full flex-col gap-y-1">
        <p className="break-all text-label3 text-neutral-900">
          {isAddress(userName) ? (
            <TradingCopilotTooltip content={userName}>
              {getShortWalletHex(userName)}
            </TradingCopilotTooltip>
          ) : (
            userName
          )}{' '}
          <span className="inline-flex items-center gap-x-1 text-body3 text-neutral-600">
            got{' '}
            <span className="inline-flex items-center justify-center gap-x-1">
              <TokenIcon tokenAddress={toast.tokenIn.address}/>
              <span>
                <TradingCopilotTooltip
                  content={formatBigNumber(
                    getWholeNumber(toast.tokenIn.amount.toString()),
                  )}
                >
                  {zerosIndex ? (
                    <>
                      0.0
                      <span className="inline-block translate-y-1 px-px text-xs">
                        {zerosIndex}
                      </span>
                      {roundedNumber}
                    </>
                  ) : (
                    roundedNumber
                  )}
                </TradingCopilotTooltip>{' '}
                {toast.tokenIn.symbol}
              </span>
            </span>
          </span>
        </p>
        <div className="flex w-full justify-between">
          <p className="text-body6 text-mint-700">
            <TimeDifferenceCounter timestamp={toast.timestamp} text="ago"/>
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
