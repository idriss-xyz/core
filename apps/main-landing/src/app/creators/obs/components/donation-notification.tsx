'use client';

import { useMemo, type CSSProperties } from 'react';
import Image from 'next/image';

import { IDRISS_ICON_CIRCLE, NOTIFICATION_SOUND } from '@/assets';

import { useDonationNotification } from '../hooks/use-donation-notification';

export type DonationNotificationProperties = {
  txnHash: string;
  donor: string;
  amount: string;
  message: string;
  bgColor?: string;
  customIcon?: string;
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
      id="fader"
      role="alert"
      aria-live="polite"
      nonce={txnHash}
      style={style}
      className={`absolute left-0 top-0 flex items-center rounded-r-md p-4 transition-opacity duration-1000 ${bgColor} ${
        showNotification ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex size-14 items-center justify-center">
        <Image
          className="h-14 w-auto rounded-full"
          src={customIcon}
          alt="IDRISS logo"
        />
      </div>
      <div>
        <p id="baseInfo" className="ml-3 text-xl font-bold text-neutral-900">
          {`${donor} sent $${amount}`}
        </p>
        {message && (
          <p id="message" className="ml-3 text-lg font-medium text-neutral-900">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default DonationNotification;
