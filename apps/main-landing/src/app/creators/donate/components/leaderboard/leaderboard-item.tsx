import { Icon } from '@idriss-xyz/ui/icon';
import { Link } from '@idriss-xyz/ui/link';
import { classes } from '@idriss-xyz/ui/utils';
import { DonationUser } from '@idriss-xyz/constants';
import { formatFiatValue } from '@idriss-xyz/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';

import { LeaderboardAvatar } from '../../../components/leaderboard/leaderboard-avatar';

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
  donorDetails: DonationUser;
  hideBottomBorder?: boolean;
  isTwitchExtension?: boolean;
  onDonorClick?: (displayName: string) => void;
  isDemo?: boolean;
};

export const LeaderboardItem = ({
  donorRank,
  className,
  isLastItem,
  donateAmount,
  onDonorClick,
  donorDetails,
  isDemo,
}: Properties) => {
  const displayName = donorDetails.displayName ?? 'anon';
  const avatarSourceUrl = donorDetails.avatarUrl;

  const avatarImage = (
    <LeaderboardAvatar
      rank={donorRank}
      avatarUrl={avatarSourceUrl}
      allowAllUrls={isDemo}
    />
  );

  return (
    <li
      className={classes(
        'grid grid-cols-[16px,1fr,64px] items-center gap-x-3.5 border-b px-5.5 py-[17.25px] text-body5',
        isLastItem ? 'border-b-transparent' : 'border-b-neutral-300',
        className,
      )}
    >
      <span className="text-neutral-600">{donorRank + 1}</span>

      <span className="flex items-center gap-x-1.5 overflow-hidden text-neutral-900">
        {avatarImage}

        {displayName === 'anon' ? (
          <span className="overflow-hidden text-ellipsis text-body5 text-neutral-900 lg:text-body5">
            {displayName}
          </span>
        ) : (
          <Link
            size="xs"
            onClick={() => {
              if (onDonorClick) {
                onDonorClick(displayName);
              }
            }}
            className={classes(
              'overflow-hidden text-ellipsis border-0 text-body5 text-neutral-900 no-underline lg:text-body5',
              onDonorClick && 'cursor-pointer',
            )}
          >
            {displayName}
          </Link>
        )}
      </span>

      {donateAmount === 0 ? (
        <span className="flex justify-end text-neutral-900">
          <span className="inline-flex items-center gap-1">
            <span>–</span>
            <TooltipProvider delayDuration={400}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Icon
                    className="text-neutral-600"
                    name="HelpCircle"
                    size={12}
                  />
                </TooltipTrigger>
                <TooltipContent className="bg-black text-center text-white">
                  <p>
                    The collectibles sent had no market offers at the time of
                    receiving
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
        </span>
      ) : (
        <span className="text-right text-neutral-900">
          {formatFiatValue(donateAmount)}
        </span>
      )}
    </li>
  );
};

type PlaceholderProperties = {
  donorRank: number;
  amountToDisplay: number;
  hideBottomBorder?: boolean;
  hideEncouragement?: boolean;
  previousDonateAmount: number;
};

export function LeaderboardItemPlaceholder({
  donorRank,
  amountToDisplay,
  hideBottomBorder,
  hideEncouragement,
  previousDonateAmount,
}: PlaceholderProperties) {
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
        <li className="grid grid-cols-[16px,1fr,64px] items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5">
          <span className="text-neutral-600">{donorRank + 1}</span>

          <span className="flex items-center gap-x-1.5 overflow-hidden text-neutral-900">
            {avatarPlaceholder}
            <span className="select-none blur-sm">user.eth</span>
          </span>

          <span className="select-none text-right text-neutral-900 blur-sm">
            {formatFiatValue(donateAmount)}
          </span>
        </li>

        {amountToDisplay - 1 - donorRank > 0 && (
          <span className="flex flex-1 items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5 text-center text-label4 gradient-text-2">
            {!hideEncouragement &&
              `Donate now and claim ${rankPlaces[donorRank]} place`}
          </span>
        )}
      </>
    );
  }

  return (
    <>
      {placeholderPlaces > 0 && (
        <span
          className={classes(
            'flex flex-1 items-center justify-center border-b',
            hideBottomBorder ? 'border-b-transparent' : 'border-b-neutral-300',
          )}
        />
      )}
    </>
  );
}
