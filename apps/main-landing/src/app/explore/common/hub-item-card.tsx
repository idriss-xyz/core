/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@idriss-xyz/ui/button';
import { Icon, IconName } from '@idriss-xyz/ui/icon';
import { classes } from '@idriss-xyz/ui/utils';

import type { HubStreamerUser } from '../types';

export interface CardTheme {
  borderClass?: string;
  backgroundClass: string;
  followersTextClass: string;
  donateButtonIntent: 'primary' | 'secondary';
  donateButtonClass?: string;
  donateButtonNoStatsIntent?: 'primary' | 'secondary';
  donateButtonNoStatsClass?: string;
  colorScheme?: 'blue';
  featuredBackgroundClass?: string;
  featuredNameTextClass?: string;
}

interface Properties {
  streamer: HubStreamerUser;
  theme: CardTheme;
}

export default function HubItemCard({ streamer, theme }: Properties) {
  const hasFollowers = !!streamer.stats?.followers;
  const showBorder = streamer.featured;

  const isFeaturedWithColor = streamer.featured && theme.colorScheme;

  const cardBgClass =
    isFeaturedWithColor && theme.featuredBackgroundClass
      ? theme.featuredBackgroundClass
      : theme.backgroundClass;

  const nameTextClass = classes(
    'truncate text-heading5',
    isFeaturedWithColor && theme.featuredNameTextClass
      ? theme.featuredNameTextClass
      : 'text-neutral-900',
  );

  const descriptionTextClass = classes(
    'line-clamp-2 text-body4',
    isFeaturedWithColor ? 'text-neutral-100' : 'text-neutral-600',
  );

  const link =
    streamer.donationLink ??
    streamer.donationLink ??
    streamer.followLink ??
    '#';

  const hasDonateLink = !!(streamer.donationLink ?? streamer.donationLink);

  const buttonText = hasDonateLink ? 'DONATE' : 'FOLLOW';
  const buttonIcon: IconName = hasDonateLink ? 'HandCoins' : 'Plus';

  const buttonIntent = streamer.featured
    ? (theme.donateButtonNoStatsIntent ??
      (theme.donateButtonIntent === 'primary' ? 'secondary' : 'primary'))
    : theme.donateButtonIntent;

  const buttonClass = streamer.featured
    ? (theme.donateButtonNoStatsClass ?? theme.donateButtonClass ?? 'w-full')
    : (theme.donateButtonClass ?? 'w-full');

  return (
    <div
      className={classes(
        'flex w-[279px] shrink-0 flex-col gap-[10px] rounded-[16px]',
        showBorder && ['border-[1.5px]', theme.borderClass],
        cardBgClass,
        'px-2 pb-4 pt-2 shadow-sm',
      )}
    >
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#D9D9D9]">
        <img
          src={streamer.profilePictureUrl}
          alt={streamer.name}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className={nameTextClass}>{streamer.name}</p>

        {streamer.featured && streamer.description && (
          <p className={descriptionTextClass}>{streamer.description}</p>
        )}

        {hasFollowers ? (
          <div className="flex items-center gap-[29px]">
            <div
              className={`flex w-[64px] items-center gap-2 ${theme.followersTextClass}`}
            >
              <Icon name="Users2" size={16} />
              <span className="text-body4">{streamer.stats!.followers}</span>
            </div>
            <Button
              intent={buttonIntent}
              className={buttonClass}
              size="medium"
              asLink
              isExternal
              href={link}
              suffixIconName={buttonIcon}
              colorScheme={theme.colorScheme}
            >
              {buttonText}
            </Button>
          </div>
        ) : (
          <Button
            intent={buttonIntent}
            className={buttonClass}
            size="medium"
            asLink
            isExternal
            href={link}
            suffixIconName={buttonIcon}
            colorScheme={theme.colorScheme}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
