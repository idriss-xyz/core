import { Link } from '@idriss-xyz/ui/link';
import { LeaderboardStats } from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';

import { LeaderboardAvatar } from './leaderboard-avatar';

type Properties = {
  item: LeaderboardStats;
  index: number;
  onDonorClick?: (donorName: string) => void;
};

export const LeaderboardItemDonor = ({
  item,
  index,
  onDonorClick,
}: Properties) => {
  const avatarSourceUrl = item.avatarUrl;
  const displayName = item.displayName;

  return (
    <>
      <LeaderboardAvatar rank={index} avatarUrl={avatarSourceUrl} />

      <Link
        size="xs"
        onClick={() => {
          if (displayName && displayName !== 'anon') {
            onDonorClick?.(displayName);
          }
        }}
        className={classes(
          'overflow-hidden text-ellipsis border-0 text-body5 text-neutral-900 no-underline lg:text-body5',
          displayName !== 'anon' && onDonorClick && 'cursor-pointer',
        )}
      >
        {displayName}
      </Link>
    </>
  );
};
