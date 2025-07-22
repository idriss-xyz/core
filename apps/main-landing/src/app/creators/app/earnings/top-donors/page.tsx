'use client';
import { useMemo, useState } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import {
  calculateDonationLeaderboard,
  getFilteredDonationsByPeriod,
} from '@idriss-xyz/utils';
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
  const allDonations = useMemo(
    () => {return tipHistoryQuery.data?.donations ?? []},
    [tipHistoryQuery.data?.donations],
  );

  const leaderboard = useMemo(() => {
    const allTimeLeaderboard = calculateDonationLeaderboard(allDonations);

    if (activeFilter === 'All time') {
      return allTimeLeaderboard;
    }

    const donorSinceMap = new Map(
      allTimeLeaderboard.map((item) => {
        return [item.address, item.donorSince];
      }),
    );

    const periodMap = {
      '30 days': '30d',
      '7 days': '7d',
    };

    const period = periodMap[activeFilter as keyof typeof periodMap];
    const filteredDonations = getFilteredDonationsByPeriod(
      allDonations,
      period,
    );

    const filteredLeaderboard = calculateDonationLeaderboard(filteredDonations);

    return filteredLeaderboard.map((item) => {
      return {
        ...item,
        donorSince: donorSinceMap.get(item.address) ?? item.donorSince,
      };
    });
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
