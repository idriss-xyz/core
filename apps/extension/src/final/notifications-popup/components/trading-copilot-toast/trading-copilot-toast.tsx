import { Button } from '@idriss-xyz/ui/button';
import { isAddress } from 'viem';
import { MutableRefObject, useRef } from 'react';

import { Icon, PreloadedImage } from 'shared/ui';
import { getShortWalletHex, TimeDifferenceCounter } from 'shared/utils';
import { roundToSignificantFiguresForCopilotTrading } from 'shared/web3';
import { useTradingCopilot } from 'shared/extension';

import { TokenIcon } from '../../utils';

import { Properties } from './trading-copilot-toast.types';

export const TradingCopilotToast = ({
  toast,
  ensName,
  avatarImage,
  openDialog,
  tokenImage,
  tokenData,
}: Properties) => {
  const { toastSoundEnabled } = useTradingCopilot();
  const playedTransactionHashes: MutableRefObject<Set<string>> = useRef(
    new Set(),
  );
  const audioInstanceReference: MutableRefObject<HTMLAudioElement | null> =
    useRef(null);
  const lastPlayedTimestampReference: MutableRefObject<number | null> =
    useRef(null);

  if (toastSoundEnabled && toast.soundFile) {
    playNotificationSound(
      toast.transactionHash,
      playedTransactionHashes,
      audioInstanceReference,
      lastPlayedTimestampReference,
      toast.soundFile,
    );
  }

  const userName = ensName ?? toast.from;

  const { value: roundedNumber, index: zerosIndex } =
    roundToSignificantFiguresForCopilotTrading(toast.tokenIn.amount, 2);

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
              <TokenIcon tokenImage={tokenImage} tokenData={tokenData} />
              <span>
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
                )}{' '}
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

const playNotificationSound = (
  transactionHash: string,
  playedTransactionHashes: MutableRefObject<Set<string>>,
  audioInstanceReference: MutableRefObject<HTMLAudioElement | null>,
  lastPlayedTimestampReference: MutableRefObject<number | null>,
  soundFile?: string,
) => {
  try {
    if (playedTransactionHashes.current.has(transactionHash)) {
      return;
    }

    const now = Date.now();

    if (
      lastPlayedTimestampReference.current &&
      now - lastPlayedTimestampReference.current < 1000
    ) {
      return;
    }

    if (
      !audioInstanceReference.current ||
      audioInstanceReference.current.ended ||
      audioInstanceReference.current.paused
    ) {
      audioInstanceReference.current = new Audio(soundFile);
      audioInstanceReference.current.addEventListener('ended', () => {
        audioInstanceReference.current = null;
      });
    }

    if (audioInstanceReference.current?.paused) {
      audioInstanceReference.current.play().catch((error) => {
        console.error('Failed to play notification sound:', error);
      });
    }

    playedTransactionHashes.current.add(transactionHash);
    lastPlayedTimestampReference.current = now;
  } catch (error) {
    console.error('Error while trying to play notification sound:', error);
  }
};
