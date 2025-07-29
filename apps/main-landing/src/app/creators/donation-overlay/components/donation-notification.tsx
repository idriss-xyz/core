'use client';

import { useMemo, type CSSProperties } from 'react';
import { ChainToken, CREATOR_API_URL } from '@idriss-xyz/constants';
import { Badge } from '@idriss-xyz/ui/badge';
import { formatTokenValue } from '@idriss-xyz/utils';
import { formatUnits } from 'viem';
import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_ICON_CIRCLE, DEFAULT_TRUMPET_SOUND } from '@/assets';

import { useDonationNotification } from '../hooks/use-donation-notification';
import { soundMap } from '../../constants';
import { MinimumAmounts, EnableToggles } from '../page';

export type DonationNotificationProperties = {
  donor: string;
  amount: string;
  message: string;
  sfxText?: string;
  txnHash: string;
  bgColor?: string;
  avatarUrl?: string;
  minimumAmounts: MinimumAmounts;
  enableToggles: EnableToggles;
  customIcon?: string;
  style?: CSSProperties;
  alertSound?: string;
  creatorName?: string;
  token: {
    amount: bigint;
    details?: ChainToken;
  };
  minOverallVisibleDuration: number; // Minimum total time the notification should be visible
  onFullyComplete: () => void; // Callback when the notification lifecycle is complete
};

export default function DonationNotification({
  donor,
  token,
  amount,
  txnHash,
  message,
  sfxText,
  avatarUrl,
  minimumAmounts,
  enableToggles,
  style = {},
  bgColor = 'bg-white',
  customIcon = IDRISS_ICON_CIRCLE.src,
  alertSound = 'DEFAULT_TRUMPET_SOUND',
  creatorName,
  minOverallVisibleDuration,
  onFullyComplete,
}: DonationNotificationProperties) {
  const audioSource = useMemo(() => {
    if (alertSound === 'upload' && creatorName) {
      return `${CREATOR_API_URL}/creator-profile/audio/${creatorName}`;
    }
    return soundMap[alertSound] ?? DEFAULT_TRUMPET_SOUND;
  }, [alertSound, creatorName]);

  const audio = useMemo(() => {
    return new Audio(audioSource);
  }, [audioSource]);

  const { showNotification } = useDonationNotification(
    audio,
    amount,
    minimumAmounts,
    enableToggles,
    message,
    sfxText,
    minOverallVisibleDuration,
    onFullyComplete,
  );

  return (
    <div
      role="alert"
      style={style}
      nonce={txnHash}
      aria-live="polite"
      className={classes(
        'absolute left-0 top-0 m-3 flex w-max min-w-[400px] max-w-[450px] items-start gap-x-2 rounded-xl p-4 shadow-lg transition-opacity duration-1000',
        showNotification ? 'opacity-100' : 'opacity-0',
        bgColor,
      )}
    >
      <div className="flex shrink-0 items-center justify-center">
        <img
          src={avatarUrl ?? customIcon}
          alt={avatarUrl ? 'Donor avatar' : 'Icon avatar'}
          className={classes(
            'size-12 rounded-full',
            avatarUrl && 'border border-neutral-400',
          )}
        />
      </div>

      <div className="flex flex-col justify-center gap-y-1">
        <p className="flex flex-row flex-wrap items-center gap-x-1 text-label3 text-neutral-900">
          {`${donor} `}

          {!token.details && (
            <span className="text-body3 text-neutral-600">sent ${amount}</span>
          )}

          {token.details && (
            <>
              <span className="text-body3 text-neutral-600">
                sent{' '}
                {formatTokenValue(
                  Number.parseFloat(
                    formatUnits(token.amount, Number(token.details?.decimals)),
                  ),
                )}{' '}
                {token.details?.symbol}{' '}
              </span>
              <img
                alt=""
                src={token.details?.logo}
                className="size-6 rounded-full"
              />{' '}
              <Badge type="success" variant="subtle">
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

        {message && <p className="text-body5 text-neutral-600">{message}</p>}
      </div>
    </div>
  );
}
