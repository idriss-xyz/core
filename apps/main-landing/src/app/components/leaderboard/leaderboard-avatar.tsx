import { useState } from 'react';
import { Icon } from '@idriss-xyz/ui/icon';

import { WHITELISTED_URLS } from '../../donate/constants';

const RANK_BORDERS = [
  'border-[#FAC928]',
  'border-[#979797]',
  'border-[#934F0A]',
];
const RANK_COLORS = ['text-[#FAC928]', 'text-[#979797]', 'text-[#934F0A]'];

interface Properties {
  rank: number; // 0–based
  avatarUrl?: string | null; // may be '', undefined, null
  allowAllUrls?: boolean; // only true for non-twith extension allowed
}

export const LeaderboardAvatar = ({
  rank,
  avatarUrl = '',
  allowAllUrls = false,
}: Properties) => {
  const [failed, setFailed] = useState(false);

  const isAllowed =
    !!avatarUrl &&
    (allowAllUrls ||
      WHITELISTED_URLS.some((d) => {
        return avatarUrl.startsWith(d);
      }));

  const border =
    rank <= 2 ? `border-2 ${RANK_BORDERS[rank]}` : 'border border-neutral-400';

  return (
    <div className="relative w-max">
      {isAllowed && !failed ? (
        <img
          alt={`Rank ${rank + 1}`}
          src={avatarUrl}
          className={`size-8 rounded-full bg-neutral-200 ${border}`}
          onError={() => {
            return setFailed(true);
          }}
        />
      ) : (
        <div
          className={`flex size-8 items-center justify-center rounded-full bg-neutral-200 ${border}`}
        >
          <Icon size={20} name="CircleUserRound" className="text-neutral-500" />
        </div>
      )}

      {rank <= 2 && (
        <Icon
          size={13}
          name="CrownCircled"
          className={`absolute bottom-0 right-0 ${RANK_COLORS[rank]}`}
        />
      )}
    </div>
  );
};
