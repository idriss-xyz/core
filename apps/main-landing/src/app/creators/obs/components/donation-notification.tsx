'use client';

import { useMemo, type CSSProperties } from 'react';

import { IDRISS_ICON_CIRCLE, NOTIFICATION_SOUND } from '@/assets';

import { useDonationNotification } from '../hooks/use-donation-notification';

export type DonationNotificationProperties = {
  txnHash: string;
  donor: string;
  amount: string;
  message: string;
  bgColor?: string;
  customIcon?: string;
  avatarUrl?: string;
  notificationSound?: string;
  style?: CSSProperties;
};

const NOTIFICATION_DISPLAY_DURATION = 10_000;

const DonationNotification = ({
  txnHash,
  donor,
  amount,
  message,
  bgColor = 'bg-white',
  customIcon = IDRISS_ICON_CIRCLE.src,
  avatarUrl,
  notificationSound = NOTIFICATION_SOUND,
  style = {},
}: DonationNotificationProperties) => {
  const audio = useMemo(() => {
    return new Audio(notificationSound);
  }, [notificationSound]);

  const { showNotification } = useDonationNotification(
    audio,
    amount,
    NOTIFICATION_DISPLAY_DURATION,
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
            {`${donor} `}
            <span className="text-body3 text-neutral-600">{`sent $${amount}`}</span>
          </p>
        </div>
        {message && <p className="text-body5 text-neutral-600">{message}</p>}
      </div>
    </div>
  );
};

export default DonationNotification;
