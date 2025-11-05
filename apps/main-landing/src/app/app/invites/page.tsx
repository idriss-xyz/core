// import AvailableRewardsCard from './available-rewards';
import { formatFiatValue } from '@idriss-xyz/utils';
import { TOKEN } from '@idriss-xyz/constants';

import SuccessfulInvitesCard from './succesful-invites';
// import TotalRewardsCard from './total-rewards';
import StreamersTable from './streamers-table';
import GeneralStatCard from './general-stat';

// ts-unused-exports:disable-next-line
export default function InvitesPage() {
  const {
    // availableRewards,s
    successfulInvites,
    successfulInvitesUsers,
    // totalRewards,
  } = {
    // availableRewards: 32,
    successfulInvites: 32,
    successfulInvitesUsers: [
      {
        profilePictureUrl: TOKEN.IDRISS.logo,
        displayName: 'John Doe',
      },
      {
        profilePictureUrl: TOKEN.IDRISS.logo,
        displayName: 'Jane Doe',
      },
    ],
    // totalRewards: 100,
  }; // TODO: Hook to data (useRewards)
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {/* <AvailableRewardsCard availableRewards={availableRewards} /> */}
        <SuccessfulInvitesCard
          successfulInvites={successfulInvites}
          successfulInvitesUsers={successfulInvitesUsers}
        />
        <GeneralStatCard header="Invite rank" stat="#16" />
        <GeneralStatCard header="Network earnings" stat={formatFiatValue(1152.42)} />
        {/* <TotalRewardsCard totalRewards={totalRewards} /> */}
        <StreamersTable />
      </div>
    </div>
  );
}
