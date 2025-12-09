/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@idriss-xyz/ui/button';
import { Icon, IconName } from '@idriss-xyz/ui/icon';

import type { HubStreamerUser } from '../types';

export interface CardTheme {
  borderClass: string;
  backgroundClass: string;
  followersTextClass: string;
  donateButtonIntent: 'primary' | 'secondary';
  donateButtonClass?: string;
  donateButtonNoStatsIntent?: 'primary' | 'secondary';
  donateButtonNoStatsClass?: string;
  donateButtonText: string;
  donateButtonIcon: IconName;
}

interface Properties {
  streamer: HubStreamerUser;
  theme: CardTheme;
}

export default function HubItemCard({ streamer, theme }: Properties) {
  const hasFollowers = !!streamer.stats?.followers;

  const buttonIntent = hasFollowers
    ? theme.donateButtonIntent
    : (theme.donateButtonNoStatsIntent ??
      (theme.donateButtonIntent === 'primary' ? 'secondary' : 'primary'));

  const buttonClass = hasFollowers
    ? (theme.donateButtonClass ?? 'w-full')
    : (theme.donateButtonNoStatsClass ?? theme.donateButtonClass ?? 'w-full');

  return (
    <div
      className={`flex w-[279px] shrink-0 flex-col gap-[10px] rounded-[16px] border-[1.5px] ${theme.borderClass} ${theme.backgroundClass} px-2 pb-4 pt-2 shadow-sm`}
    >
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#D9D9D9]">
        <img
          src={streamer.profilePictureUrl}
          alt={streamer.name}
          className="size-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="truncate text-heading5 text-neutral-900">
          {streamer.name}
        </p>

        {streamer.description && (
          <p className="line-clamp-2 text-body4 text-neutral-600">
            {streamer.description}
          </p>
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
              href={streamer.donationLink}
              suffixIconName={theme.donateButtonIcon}
            >
              {theme.donateButtonText}
            </Button>
          </div>
        ) : (
          <Button
            intent={buttonIntent}
            className={buttonClass}
            size="medium"
            asLink
            isExternal
            href={streamer.donationLink}
            suffixIconName={theme.donateButtonIcon}
          >
            {theme.donateButtonText}
          </Button>
        )}
      </div>
    </div>
  );
}
