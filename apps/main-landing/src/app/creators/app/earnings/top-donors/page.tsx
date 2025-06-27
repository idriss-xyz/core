'use client';
import { Hex } from 'viem';

import { useGetTipHistory } from '@/app/creators/donate/commands/get-donate-history';
import { Leaderboard } from '@/app/creators/donate/components/leaderboard';

// ts-unused-exports:disable-next-line
export default function TopDonors() {
  const tipHistoryQuery = useGetTipHistory({
    address: '0x7D716741D2c37925e5E15123025400Be80ec796d',
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
          data: '0x7D716741D2c37925e5E15123025400Be80ec796d' as Hex,
          isFetching: false,
        }}
        className="container w-full overflow-hidden px-0"
      />
    </div>
  );
}
