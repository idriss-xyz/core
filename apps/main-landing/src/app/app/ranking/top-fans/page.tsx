'use client';
import { useCallback, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';

import { Leaderboard } from '@/app/components/leaderboard';

import { useGetLeaderboard, periodMap } from '../commands/use-get-leaderboard';
import SkeletonRanking from '../loading';

// ts-unused-exports:disable-next-line
export default function TopDonors() {
  const [activeFilter, setActiveFilter] = useState('All time');
  const { user, ready, authenticated } = usePrivy();
  const address = user?.wallet?.address as Hex | undefined;

  const leaderboardQuery = useGetLeaderboard({
    type: 'donor',
    period: periodMap[activeFilter]!,
  });

  const onDonorClick = useCallback(
    (displayName: string) => {
      const donor = leaderboardQuery.data?.find((d) => {
        return d.displayName === displayName;
      });
      if (donor && donor.displayName !== 'anon') {
        window.open(`/fan/${donor.displayName}`);
      }
    },
    [leaderboardQuery.data],
  );

  if (leaderboardQuery.isLoading || !ready || !authenticated) {
    return <SkeletonRanking />;
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
        title="Top Fans"
        variant="creatorsDashboard"
        className="overflow-hidden px-0 shadow-lg"
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        scope="global"
        onDonorClick={onDonorClick}
      />
    </div>
  );
}
