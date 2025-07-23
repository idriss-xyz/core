'use client';
import { useState } from 'react';
import { CREATOR_APP_TEST_ADDRESS } from '@idriss-xyz/constants';

import { Leaderboard } from '@/app/creators/donate/components/leaderboard';

import { useGetLeaderboard, periodMap } from '../commands/use-get-leaderboard';

// ts-unused-exports:disable-next-line
export default function TopCreators() {
  const [activeFilter, setActiveFilter] = useState('All time');

  const leaderboardQuery = useGetLeaderboard({
    type: 'creator',
    period: periodMap[activeFilter]!,
  });

  return (
    <div>
      <Leaderboard
        leaderboard={leaderboardQuery.data ?? []}
        leaderboardError={leaderboardQuery.isError}
        leaderboardLoading={leaderboardQuery.isLoading}
        address={{
          isValid: true,
          data: CREATOR_APP_TEST_ADDRESS,
          isFetching: false,
        }}
        title="Top Creators"
        variant="creatorsDashboard"
        className="container overflow-hidden px-0 shadow-lg"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        perspective="creator"
      />
    </div>
  );
}
