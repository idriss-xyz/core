import { Icon } from '@idriss-xyz/ui/icon';
import { Link } from '@idriss-xyz/ui/link';
import { getShortWalletHex } from '@idriss-xyz/utils';
import { classes } from '@idriss-xyz/ui/utils';
import { Hex } from 'viem';

import { DonationUser } from '../../types';
import { WHITELISTED_URLS } from '../../constants';
import { useGetAvatarImage } from '../../commands/get-avatar-image';

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
  onDonorClick?: (address: Hex) => void;
};

export const LeaderboardItem = ({
  donorRank,
  className,
  isLastItem,
  donateAmount,
  onDonorClick,
  donorDetails,
  isTwitchExtension,
}: Properties) => {
  const displayName = donorDetails.displayName;
  const avatarSourceUrl = donorDetails.avatarUrl;

  const isAllowedUrl =
    !isTwitchExtension ||
    !!(
      avatarSourceUrl &&
      WHITELISTED_URLS.some((domain) => {
        return avatarSourceUrl.startsWith(domain);
      })
    );

  const avatarDataQuery = useGetAvatarImage(
    { url: avatarSourceUrl ?? '' },
    { enabled: !!avatarSourceUrl && !isAllowedUrl },
  );

  const avatarImage = (
    <div className="relative w-max">
      {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
      {((avatarSourceUrl && isAllowedUrl) ||
        (avatarSourceUrl && !isAllowedUrl && !!avatarDataQuery.data)) && (
        <img
          alt={`Rank ${donorRank + 1}`}
          src={isAllowedUrl ? avatarSourceUrl : avatarDataQuery.data}
          className={`size-8 rounded-full bg-neutral-200 ${donorRank <= 2 ? `border-2 ${rankBorders[donorRank]}` : 'border border-neutral-400'}`}
        />
      )}

      {(!avatarSourceUrl || (!isAllowedUrl && !avatarDataQuery.data)) && (
        <div
          className={`flex size-8 items-center justify-center rounded-full ${donorRank <= 2 ? `border-2 ${rankBorders[donorRank]}` : 'border border-neutral-300'} bg-neutral-200`}
        >
          <Icon size={20} name="CircleUserRound" className="text-neutral-500" />
        </div>
      )}

      {donorRank <= 2 && (
        <Icon
          size={13}
          name="CrownCircled"
          className={`absolute bottom-0 right-0 ${rankColors[donorRank]}`}
        />
      )}
    </div>
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

        <Link
          size="xs"
          onClick={() => {
            if (onDonorClick) {
              onDonorClick(donorDetails.address);
            }
          }}
          className={classes(
            'overflow-hidden text-ellipsis border-0 text-body5 text-neutral-900 no-underline lg:text-body5',
            onDonorClick && 'cursor-pointer',
          )}
        >
          {displayName ?? getShortWalletHex(donorDetails.address)}
        </Link>
      </span>

      <span className="text-right text-neutral-900">
        $
        {donateAmount >= 0.01
          ? new Intl.NumberFormat('en-US', {
              minimumFractionDigits: donateAmount % 1 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            }).format(Number(donateAmount ?? 0))
          : '<0.01'}
      </span>
    </li>
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
  const placeholderHeight = itemHeight ?? 69;
  const donateAmount = previousDonateAmount * 0.8;

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
            $
            {donateAmount >= 0.01
              ? new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: donateAmount % 1 === 0 ? 0 : 2,
                  maximumFractionDigits: 2,
                }).format(Number(donateAmount ?? 0))
              : '<0.01'}
          </span>
        </li>

        {amountToDisplay - 1 - donorRank && (
          <span
            style={{
              height: `${(amountToDisplay - 1 - donorRank) * placeholderHeight}px`,
            }}
            className="flex items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5 text-center text-label4 gradient-text-2"
          >
            {!hideEncouragement &&
              `Donate now and claim ${rankPlaces[donorRank]} place`}
          </span>
        )}
      </>
    );
  }

  return (
    <>
      {amountToDisplay - donorRank && (
        <span
          style={{
            height: `${(amountToDisplay - donorRank) * placeholderHeight}px`,
          }}
          className={classes(
            'flex items-center justify-center border-b',
            hideBottomBorder ? 'border-b-transparent' : 'border-b-neutral-300',
          )}
        />
      )}
    </>
  );
}
