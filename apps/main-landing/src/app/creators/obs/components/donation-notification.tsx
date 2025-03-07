'use client';

import { useMemo, type CSSProperties } from 'react';
import { ChainToken } from '@idriss-xyz/constants';
import { Badge } from '@idriss-xyz/ui/badge';
import { roundToSignificantFiguresForCopilotTrading } from '@idriss-xyz/utils';
import { formatUnits } from 'viem';

import { IDRISS_ICON_CIRCLE, NOTIFICATION_SOUND } from '@/assets';

import { useDonationNotification } from '../hooks/use-donation-notification';

export type DonationNotificationProperties = {
  donor: string;
  amount: string;
  message: string;
  txnHash: string;
  bgColor?: string;
  avatarUrl?: string;
  customIcon?: string;
  style?: CSSProperties;
  notificationSound?: string;
  token: {
    amount: bigint;
    details?: ChainToken;
  };
};

const NOTIFICATION_DISPLAY_DURATION = 10_000;

const DonationNotification = ({
  donor,
  token,
  amount,
  txnHash,
  message,
  avatarUrl,
  style = {},
  bgColor = 'bg-white',
  customIcon = IDRISS_ICON_CIRCLE.src,
  notificationSound = NOTIFICATION_SOUND,
}: DonationNotificationProperties) => {
  const audio = useMemo(() => {
    return new Audio(notificationSound);
  }, [notificationSound]);

  const { showNotification } = useDonationNotification(
    audio,
    amount,
    NOTIFICATION_DISPLAY_DURATION,
  );

  const { value: roundedNumber, index: zerosIndex } =
    roundToSignificantFiguresForCopilotTrading(
      Number.parseFloat(
        formatUnits(token.amount, Number(token.details?.decimals)),
      ),
      2,
    );

  return (
    <div
      role="alert"
      aria-live="polite"
      nonce={txnHash}
      style={style}
      className={`absolute left-0 top-0 m-3 flex w-[400px] items-start gap-x-2 rounded-xl p-4 shadow-lg transition-opacity duration-1000 ${bgColor} ${
        showNotification ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex shrink-0 items-center justify-center">
        <img
          className={`size-12 rounded-full ${
            avatarUrl ? 'border border-neutral-400' : ''
          }`}
          src={avatarUrl ?? customIcon}
          alt={avatarUrl ? 'Donor avatar' : 'IDRISS logo'}
        />
      </div>

      <div className="flex flex-col justify-center gap-y-1">
        <div className="flex items-center gap-x-2">
          <p className="text-label3 text-neutral-900">
            <span className="align-middle">{`${donor} `}</span>

            {!token.details && (
              <span className="align-middle text-body3 text-neutral-600">{`${amount ? `sent $${amount}` : ''}`}</span>
            )}

            {token.details && (
              <>
                <span className="align-middle text-body3 text-neutral-600">
                  <span className="align-middle text-body3 text-neutral-600">
                    sent{' '}
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
                    {token.details?.symbol}{' '}
                  </span>
                </span>
                <img
                  className="inline-block size-6 rounded-full align-middle"
                  src={token.details?.logo}
                  alt=""
                />{' '}
                <Badge type="success" variant="subtle" className="align-middle">
                  $
                  {Number(amount) >= 0.01
                    ? new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
                        maximumFractionDigits: 2,
                      }).format(Number(amount))
                    : '<0.01'}
                </Badge>
              </>
            )}
          </p>
        </div>

        {message && <p className="text-body5 text-neutral-600">{message}</p>}
      </div>
    </div>
  );
};

export default DonationNotification;
