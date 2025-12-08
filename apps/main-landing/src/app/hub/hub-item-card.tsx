/* eslint-disable @next/next/no-img-element */
'use client';

import { Button } from '@idriss-xyz/ui/button';

import type { HubStreamerUser } from './types';

interface HubItemCardProperties {
  streamer: HubStreamerUser;
}

export default function HubItemCard({ streamer }: HubItemCardProperties) {
  return (
    <div className="flex w-[279px] shrink-0 flex-col gap-[10px] rounded-[16px] border-[1.5px] border-mint-400 bg-white px-2 pb-4 pt-2 shadow-sm">
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
        <Button
          className="w-full"
          intent="secondary"
          size="medium"
          isExternal
          asLink
          href={streamer.donationLink}
          suffixIconName="HandCoins"
        >
          DONATE
        </Button>
      </div>
    </div>
  );
}
