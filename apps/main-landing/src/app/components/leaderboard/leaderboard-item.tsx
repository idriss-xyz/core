import { Link } from '@idriss-xyz/ui/link';
import { formatFiatValue, getTimeDifferenceString } from '@idriss-xyz/utils';
import { classes } from '@idriss-xyz/ui/utils';
import { DonationUser } from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';

import { LeaderboardAvatar } from './leaderboard-avatar';

const rankBorders = [
  'border-[#FAC928]',
  'border-[#979797]',
  'border-[#934F0A]',
];
const rankPlaces = ['1st', '2nd', '3rd'];
const rankColors = ['text-[#FAC928]', 'text-[#979797]', 'text-[#934F0A]'];

type Properties = {
  donorRank: number;
  className?: string;
  isLastItem?: boolean;
  donateAmount: number;
  donorSince?: number;
  donationCount?: number;
  donorDetails: DonationUser;
  hideBottomBorder?: boolean;
  isTwitchExtension?: boolean;
  onDonorClick?: (displayName: string) => void;
};

export const LeaderboardItem = ({
  donorRank,
  className,
  isLastItem,
  donateAmount,
  donorSince,
  donationCount,
  onDonorClick,
  donorDetails,
  isTwitchExtension,
}: Properties) => {
  const displayName = donorDetails.displayName;
  const avatarSourceUrl = donorDetails.avatarUrl;

  return (
    <tr
      className={classes(
        'border-b text-body5',
        isLastItem ? 'border-b-transparent' : 'border-b-neutral-300',
        className,
      )}
    >
      <td className="px-4 py-3 text-neutral-600">{donorRank + 1}</td>

      <td className="flex items-center gap-x-1.5 overflow-hidden px-4 py-3 text-neutral-900">
        <LeaderboardAvatar
          rank={donorRank}
          avatarUrl={avatarSourceUrl}
          allowAllUrls={!isTwitchExtension}
        />

        <Link
          size="xs"
          onClick={() => {
            if (onDonorClick) {
              onDonorClick(donorDetails.displayName ?? 'anon');
            }
          }}
          className={classes(
            'overflow-hidden text-ellipsis border-0 text-body5 text-neutral-900 no-underline lg:text-body5',
            onDonorClick && 'cursor-pointer',
            displayName === 'anon' && 'pointer-events-none cursor-auto',
          )}
        >
          {displayName}
        </Link>
      </td>

      <td className="px-4 py-3"> {formatFiatValue(donateAmount)}</td>

      {donationCount && <td className="px-4 py-3">{donationCount}</td>}

      {donorSince && (
        <td className="px-4 py-3">
          {getTimeDifferenceString({
            text: 'ago',
            variant: 'short',
            timestamp: donorSince,
          })}
        </td>
      )}
    </tr>
  );
};

type PlaceholderProperties = {
  donorRank: number;
  itemHeight?: number;
  amountToDisplay: number;
  hideBottomBorder?: boolean;
  hideEncouragement?: boolean;
  previousDonateAmount: number;
};

export function LeaderboardItemPlaceholder({
  donorRank,
  itemHeight,
  amountToDisplay,
  hideBottomBorder,
  hideEncouragement,
  previousDonateAmount,
}: PlaceholderProperties) {
  const placeholderHeight = itemHeight ?? 67;
  const donateAmount = previousDonateAmount * 0.8;
  const placeholderPlaces = amountToDisplay - donorRank;

  const avatarPlaceholder = (
    <div className="relative w-max">
      <div
        className={`flex size-8 items-center justify-center rounded-full border-2 ${rankBorders[donorRank]} bg-neutral-200`}
      >
        <Icon size={20} name="CircleUserRound" className="text-neutral-500" />
      </div>

      <Icon
        size={13}
        name="CrownCircled"
        className={`absolute bottom-0 right-0 ${rankColors[donorRank]}`}
      />
    </div>
  );

  if (donorRank <= 2) {
    return (
      <>
        <tr className="flex items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5">
          <td className="text-neutral-600">{donorRank + 1}</td>

          <td className="flex items-center gap-x-1.5 overflow-hidden text-neutral-900">
            {avatarPlaceholder}
            <span className="select-none blur-sm">user.eth</span>
          </td>

          <td className="select-none text-right text-neutral-900 blur-sm">
            {formatFiatValue(donateAmount)}
          </td>
        </tr>

        {amountToDisplay - 1 - donorRank && (
          <tr>
            <td
              style={{
                height: `${(amountToDisplay - 1 - donorRank) * placeholderHeight}px`,
              }}
              className="flex items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5 text-center text-label4 gradient-text-2"
            >
              {!hideEncouragement &&
                `Donate now and claim ${rankPlaces[donorRank]} place`}
            </td>
          </tr>
        )}
      </>
    );
  }

  return (
    !!placeholderPlaces && (
      <tr>
        <td
          style={{
            height: `${placeholderPlaces * placeholderHeight}px`,
          }}
          className={classes(
            'flex items-center justify-center border-b',
            hideBottomBorder ? 'border-b-transparent' : 'border-b-neutral-300',
          )}
        />
      </tr>
    )
  );
}
