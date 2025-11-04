'use client';

import { useMemo } from 'react';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { Badge } from '@idriss-xyz/ui/badge';
import type { ChainToken } from '@idriss-xyz/constants';
import { formatFiatValue, formatTokenValue } from '@idriss-xyz/utils';
import { formatUnits } from 'viem';
import { classes } from '@idriss-xyz/ui/utils';

import { IDRISS_ICON_CIRCLE, DEFAULT_TRUMPET_SOUND } from '@/assets';

import { useDonationNotification } from '../hooks/use-donation-notification';
import { soundMap } from '../../constants';
import { DonationNotificationProperties, NftDetails } from '../types';
import { LayersBadge } from '../../donate/components/donate-form/components';

function isNftDetails(
  details?: NftDetails | ChainToken,
): details is NftDetails {
  return !!details && !('decimals' in details);
}

function isChainToken(
  details?: NftDetails | ChainToken,
): details is ChainToken {
  return !!details && 'decimals' in details;
}

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
  forceDisplay,
  minOverallVisibleDuration,
  onFullyComplete,
}: DonationNotificationProperties) {
  const audioSource = useMemo(() => {
    if (alertSound === 'CUSTOM_SOUND' && creatorName) {
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
    forceDisplay,
    minOverallVisibleDuration,
    onFullyComplete,
  );

  const nftDetails = isNftDetails(token.details) ? token.details : undefined;
  const erc20Details = isChainToken(token.details) ? token.details : undefined;

  const hasAvatar =
    typeof avatarUrl === 'string' && avatarUrl.trim().length > 0;

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
          src={hasAvatar ? avatarUrl : customIcon}
          alt={hasAvatar ? 'Donor avatar' : 'Icon avatar'}
          className={classes(
            'size-12 rounded-full',
            hasAvatar && 'border border-neutral-400',
          )}
        />
      </div>

      <div className="flex flex-col justify-center gap-y-1">
        <div className="flex flex-row flex-wrap items-center gap-x-1 text-label3 text-neutral-900">
          {donor}

          {!token.details && (
            <span className="text-body3 text-neutral-600">
              sent {formatFiatValue(Number(amount))}
            </span>
          )}

          {erc20Details && (
            <>
              <span className="text-body3 text-neutral-600">
                sent{' '}
                {formatTokenValue(
                  Number.parseFloat(
                    formatUnits(token.amount, Number(erc20Details.decimals)),
                  ),
                )}{' '}
                {erc20Details.symbol}{' '}
              </span>
              <img
                alt=""
                src={erc20Details.logo}
                className="size-6 rounded-full"
              />{' '}
              <Badge type="success" variant="subtle">
                {formatFiatValue(Number(amount))}
              </Badge>
            </>
          )}

          {nftDetails && (
            <span className="text-body3 text-neutral-600">
              sent {nftDetails.name}
            </span>
          )}
        </div>

        {message && <p className="text-body5 text-neutral-600">{message}</p>}

        {nftDetails && Number(amount) > 1 && (
          <div className="w-fit self-start">
            <LayersBadge amount={amount} />
          </div>
        )}

        {nftDetails && (
          <div
            key={String(nftDetails.id)}
            className="flex w-[15.5625rem] shrink-0 flex-col gap-2 rounded-xl"
          >
            <div className="flex size-full items-center justify-center overflow-hidden rounded-xl bg-gray-200">
              <img
                src={nftDetails.logo}
                alt={nftDetails.name}
                /* shrink image if the height cap is reached */
                className="h-full max-h-full w-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
