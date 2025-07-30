'use client';
import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';

import { Leaderboard } from '@/app/creators/components/leaderboard';

import { useGetLeaderboard, periodMap } from '../commands/use-get-leaderboard';

// ts-unused-exports:disable-next-line
export default function TopDonors() {
  const [activeFilter, setActiveFilter] = useState('All time');
  const { user, ready, authenticated } = usePrivy();
  const address = user?.wallet?.address as Hex | undefined;

  const leaderboardQuery = useGetLeaderboard({
    type: 'donor',
    period: periodMap[activeFilter]!,
  });

  if (leaderboardQuery.isLoading || !ready || !authenticated) {
    return null;
  }

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
        title="Top Donors"
        variant="creatorsDashboard"
        className="overflow-hidden px-0 shadow-lg"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        scope="global"
      />
    </div>
  );
}
