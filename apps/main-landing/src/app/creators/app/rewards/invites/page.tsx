import { TOKEN } from '@idriss-xyz/constants';

import AvailableRewardsCard from './available-rewards';
import SuccessfulInvitesCard from './succesful-invites';

// ts-unused-exports:disable-next-line
export default function InvitesPage() {
  const { availableRewards, successfulInvites, successfulInvitesUsers } = {
    availableRewards: 32,
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
  }; // TODO: Hook to data (useRewards)
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <AvailableRewardsCard availableRewards={availableRewards} />
        <SuccessfulInvitesCard
          successfulInvites={successfulInvites}
          successfulInvitesUsers={successfulInvitesUsers}
        />
      </div>
    </div>
  );
}
