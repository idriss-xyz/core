'use client';
import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';

import { Leaderboard } from '@/app/creators/donate/components/leaderboard';

import { useGetLeaderboard, periodMap } from '../commands/use-get-leaderboard';

// ts-unused-exports:disable-next-line
export default function TopCreators() {
  const [activeFilter, setActiveFilter] = useState('All time');
  const { user } = usePrivy();
  const address = user?.wallet?.address as Hex | undefined;

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
          isValid: !!address,
          data: address ?? null,
          isFetching: false,
        }}
        title="Top Creators"
        variant="creatorsDashboard"
        className="overflow-hidden px-0 shadow-lg"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        perspective="creator"
      />
    </div>
  );
}
