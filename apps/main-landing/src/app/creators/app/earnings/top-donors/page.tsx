'use client';
import { Hex } from 'viem';
import { Button } from '@idriss-xyz/ui/button';

import { useGetTipHistory } from '@/app/creators/app/commands/get-donate-history';
import { Leaderboard } from '@/app/creators/donate/components/leaderboard';
import { IDRISS_SCENE_STREAM_LIGHT } from '@/assets';

// ts-unused-exports:disable-next-line
export default function TopDonors() {
  const tipHistoryQuery = useGetTipHistory({
    address: '0x7D716741D2c37925e5E15123025400Be80ec796d', // TODO: Replace with user address
  });
  const donations = tipHistoryQuery.data?.leaderboard ?? [];

  return (
    <div>
      <Leaderboard
        leaderboard={donations}
        leaderboardError={tipHistoryQuery.isError}
        leaderboardLoading={tipHistoryQuery.isLoading}
        address={{
          isValid: true,
          data: '0x7D716741D2c37925e5E15123025400Be80ec796d' as Hex, // TODO: Replace with user address
          isFetching: false,
        }}
        variant="creatorsDashboard"
        className="container overflow-hidden px-0 shadow-lg"
      />
      <div className="relative mt-4 min-h-[136px] overflow-hidden rounded-lg bg-neutral-300">
        <img
          alt="footer image"
          src={IDRISS_SCENE_STREAM_LIGHT.src}
          className="absolute left-[342px] top-[-300px] rotate-[34deg] object-cover"
        />
        <div className="relative m-4 gap-4 rounded-lg bg-white/80 p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <span className="text-label4 uppercase">
              Check your rank among all creators
            </span>
            <span className="text-display5 uppercase gradient-text">
              View earnings leaderboard
            </span>
          </div>
          <Button
            asLink
            isExternal
            size="medium"
            intent="secondary"
            href="" // TODO: Add link
            suffixIconName="IdrissArrowRight"
            className="absolute left-[497px] top-8 uppercase"
          >
            Explore ranking
          </Button>
        </div>
      </div>
    </div>
  );
}
