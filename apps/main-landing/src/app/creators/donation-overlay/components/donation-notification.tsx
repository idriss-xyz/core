'use client';

import { useMemo } from 'react';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { Badge } from '@idriss-xyz/ui/badge';
import {
  formatFiatValue,
  formatTokenValue,
  getModifiedLeaderboardName,
} from '@idriss-xyz/utils';
import { formatUnits } from 'viem';
import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_ICON_CIRCLE, DEFAULT_TRUMPET_SOUND } from '@/assets';

import { useDonationNotification } from '../hooks/use-donation-notification';
import { soundMap } from '../../constants';
import { DonationNotificationProperties } from '../types';

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
  voiceId = 'TX3LPaxmHKxFdv7VOQHJ',
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
    voiceId,
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
        'flex w-full items-start gap-x-2 rounded-xl p-4 shadow-lg transition-opacity duration-1000',
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
          {`${getModifiedLeaderboardName(donor)} `}

          {!token.details && (
            <span className="text-body3 text-neutral-600">
              sent {formatFiatValue(Number(amount))}
            </span>
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
                {formatFiatValue(Number(amount))}
              </Badge>
            </>
          )}
        </p>

        {message && <p className="text-body5 text-neutral-600">{message}</p>}
      </div>
    </div>
  );
}
