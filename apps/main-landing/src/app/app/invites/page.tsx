'use client';
import { formatFiatValue } from '@idriss-xyz/utils';

import SuccessfulInvitesCard from './succesful-invites';
import StreamersTable from './streamers-table';
import GeneralStatCard from './general-stat';
import { useGetReferralHistory } from './commands/use-get-referral-history';
import SkeletonCard from './card-loading';

// ts-unused-exports:disable-next-line
export default function InvitesPage() {
  const { data, isLoading, isError } = useGetReferralHistory();

  if (isLoading) return <SkeletonCard />;
  if (isError || !data) return <div>Error loading invites</div>;

  const {
    successfulInvites,
    successfulInvitesUsers,
    suggestedInvitees,
    inviteRank,
    networkEarnings,
  } = data;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <SuccessfulInvitesCard
          successfulInvites={successfulInvites}
          successfulInvitesUsers={successfulInvitesUsers}
        />
        <GeneralStatCard
          header="Invite rank"
          stat={inviteRank === 0 ? '-' : `#${inviteRank}`}
        />
        <GeneralStatCard
          header="Network earnings"
          stat={formatFiatValue(networkEarnings)}
        />
        <StreamersTable
          invited={successfulInvitesUsers}
          suggested={suggestedInvitees}
        />
      </div>
    </div>
  );
}
