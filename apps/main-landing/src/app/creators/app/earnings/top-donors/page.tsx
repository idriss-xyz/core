'use client';
import { useMemo, useState } from 'react';
import { Hex } from 'viem';
import { Button } from '@idriss-xyz/ui/button';
import { calculateDonationLeaderboard } from '@idriss-xyz/utils';
import { CREATOR_APP_TEST_ADDRESS } from '@idriss-xyz/constants';

import { useGetTipHistory } from '@/app/creators/app/commands/get-donate-history';
import { Leaderboard } from '@/app/creators/donate/components/leaderboard';
import { IDRISS_SCENE_STREAM_LIGHT } from '@/assets';

// ts-unused-exports:disable-next-line
export default function TopDonors() {
  const [activeFilter, setActiveFilter] = useState('All time');
  const tipHistoryQuery = useGetTipHistory({
    address: CREATOR_APP_TEST_ADDRESS, // TODO: Replace with user address
  });
  const allDonations = tipHistoryQuery.data?.donations ?? [];

  const leaderboard = useMemo(() => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const filteredDonations = allDonations.filter((donation) => {
      // Assuming donation.timestamp is in milliseconds
      if (activeFilter === '30 days') {
        return donation.timestamp >= thirtyDaysAgo;
      }
      if (activeFilter === '7 days') {
        return donation.timestamp >= sevenDaysAgo;
      }
      return true; // 'All time'
    });

    return calculateDonationLeaderboard(filteredDonations);
  }, [allDonations, activeFilter]);

  return (
    <div>
      <Leaderboard
        leaderboard={leaderboard}
        leaderboardError={tipHistoryQuery.isError}
        leaderboardLoading={tipHistoryQuery.isLoading}
        address={{
          isValid: true,
          data: CREATOR_APP_TEST_ADDRESS, // TODO: Replace with user address
          isFetching: false,
        }}
        variant="creatorsDashboard"
        className="container overflow-hidden px-0 shadow-lg"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
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
