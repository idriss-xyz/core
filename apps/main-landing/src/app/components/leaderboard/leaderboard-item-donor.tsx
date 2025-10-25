import { Link } from '@idriss-xyz/ui/link';
import { LeaderboardStats } from '@idriss-xyz/constants';

import { LeaderboardAvatar } from './leaderboard-avatar';

type Properties = {
  item: LeaderboardStats;
  index: number;
};

export const LeaderboardItemDonor = ({ item, index }: Properties) => {
  const avatarSourceUrl = item.avatarUrl;

  return (
    <>
      <LeaderboardAvatar rank={index} avatarUrl={avatarSourceUrl} />

      <Link
        size="xs"
        className="overflow-hidden text-ellipsis border-0 text-body5 text-neutral-900 no-underline lg:text-body5"
      >
        {item.displayName}
      </Link>
    </>
  );
};
