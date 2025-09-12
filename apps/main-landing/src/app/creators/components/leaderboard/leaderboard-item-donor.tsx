import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import { LeaderboardStats } from '@idriss-xyz/constants';

import { WHITELISTED_URLS } from '../../donate/constants';
import { useGetAvatarImage } from '../../donate/commands/get-avatar-image';

const rankBorders = [
  'border-[#FAC928]',
  'border-[#979797]',
  'border-[#934F0A]',
];

const rankColors = ['text-[#FAC928]', 'text-[#979797]', 'text-[#934F0A]'];

type Properties = {
  item: LeaderboardStats;
  index: number;
};

export const LeaderboardItemDonor = ({ item, index }: Properties) => {
  const avatarSourceUrl = item.avatarUrl;

  const isAllowedUrl =
    avatarSourceUrl &&
    WHITELISTED_URLS.some((domain) => {
      return avatarSourceUrl.startsWith(domain);
    });

  const avatarDataQuery = useGetAvatarImage(
    { url: avatarSourceUrl ?? '' },
    { enabled: !!avatarSourceUrl && !isAllowedUrl },
  );

  const avatarImage = (
    <div className="relative w-max">
      {((avatarSourceUrl && isAllowedUrl) ??
        (avatarSourceUrl && !isAllowedUrl && !!avatarDataQuery.data)) && (
        <img
          alt={`Rank ${index + 1}`}
          src={isAllowedUrl ? avatarSourceUrl : avatarDataQuery.data}
          className={`size-8 rounded-full bg-neutral-200 ${index <= 2 ? `border-2 ${rankBorders[index]}` : 'border border-neutral-400'}`}
        />
      )}

      {(!avatarSourceUrl || (!isAllowedUrl && !avatarDataQuery.data)) && (
        <div
          className={`flex size-8 items-center justify-center rounded-full ${index <= 2 ? `border-2 ${rankBorders[index]}` : 'border border-neutral-300'} bg-neutral-200`}
        >
          <Icon size={20} name="CircleUserRound" className="text-neutral-500" />
        </div>
      )}

      {index <= 2 && (
        <Icon
          size={13}
          name="CrownCircled"
          className={`absolute bottom-0 right-0 ${rankColors[index]}`}
        />
      )}
    </div>
  );

  return (
    <>
      {avatarImage}

      <Link
        size="xs"
        className="overflow-hidden text-ellipsis border-0 text-body5 text-neutral-900 no-underline lg:text-body5"
      >
        {item.displayName}
      </Link>
    </>
  );
};
