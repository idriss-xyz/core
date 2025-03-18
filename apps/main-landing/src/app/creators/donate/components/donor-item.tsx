import { Icon } from '@idriss-xyz/ui/icon';
import { Link } from '@idriss-xyz/ui/link';
import { TipHistoryFromUser } from '@idriss-xyz/constants';
import { getShortWalletHex } from '@idriss-xyz/utils';
import { classes } from '@idriss-xyz/ui/utils';

import { donateContentValues } from '../types';
import { WHITELISTED_URLS } from '../../donate/constants';
import { useGetAvatarImage } from '../commands/get-avatar-image';
import { useGetEnsAvatar } from '../commands/get-ens-avatar';

const rankBorders = [
  'border-[#FAC928]',
  'border-[#979797]',
  'border-[#934F0A]',
];
const rankColors = ['text-[#FAC928]', 'text-[#979797]', 'text-[#934F0A]'];
const rankPlaces = ['1st', '2nd', '3rd'];

type Properties = {
  donorRank: number;
  className?: string;
  donateAmount: number;
  isTwitchExtension?: boolean;
  donorDetails: TipHistoryFromUser;
  updateCurrentContent?: (content: donateContentValues) => void;
};

export default function DonorItem({
  donorRank,
  className,
  donorDetails,
  donateAmount,
  isTwitchExtension,
  updateCurrentContent,
}: Properties) {
  const displayName = donorDetails.displayName?.value;
  const nameSource = donorDetails.displayName?.source;
  const imageSource = donorDetails.avatar?.source;

  const ensAvatarQuery = useGetEnsAvatar(
    { name: displayName ?? '' },
    {
      isTwitchExtension: isTwitchExtension,
      enabled: nameSource === 'ENS' && !!displayName,
    },
  );

  const farcasterAvatarUrl =
    imageSource === 'FARCASTER' ? donorDetails.avatar?.value?.url : null;

  const avatarSourceUrl = ensAvatarQuery.data ?? farcasterAvatarUrl;

  const isAllowedUrl =
    !isTwitchExtension ||
    (avatarSourceUrl &&
      WHITELISTED_URLS.some((domain) => {
        return avatarSourceUrl.startsWith(domain);
      }));

  const avatarDataQuery = useGetAvatarImage(
    { url: avatarSourceUrl ?? '' },
    { enabled: !!avatarSourceUrl && !isAllowedUrl },
  );

  const avatarImage = (
    <div className="relative w-max">
      {((avatarSourceUrl && isAllowedUrl) ??
        (avatarSourceUrl && !isAllowedUrl && avatarDataQuery.data)) && (
        <img
          src={isAllowedUrl ? avatarSourceUrl : avatarDataQuery.data}
          alt={`Rank ${donorRank + 1}`}
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

      {donorRank <= 2 ? (
        <Icon
          size={13}
          name="CrownCircled"
          className={`absolute bottom-0 right-0 ${rankColors[donorRank]}`}
        />
      ) : null}
    </div>
  );

  return (
    <li
      className={classes(
        'grid grid-cols-[10px,1fr,70px] items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5 md:grid-cols-[10px,1fr,100px]',
        className,
      )}
    >
      <span className="text-neutral-600">{donorRank + 1}</span>
      <span className="flex items-center gap-x-1.5 text-neutral-900">
        {avatarImage}
        <Link
          size="xs"
          onClick={() => {
            if (updateCurrentContent) {
              updateCurrentContent({
                name: 'userHistory',
                userDetails: donorDetails,
              });
            }
          }}
          className="cursor-pointer border-0 text-body5 text-neutral-900 no-underline lg:text-body5"
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
}

type PlaceholderProperties = {
  donorRank: number;
  itemHeight?: number;
  amountToDisplay: number;
  hideEncouragement?: boolean;
  previousDonateAmount: number;
};

export function DonorItemPlaceholder({
  donorRank,
  itemHeight,
  amountToDisplay,
  hideEncouragement,
  previousDonateAmount,
}: PlaceholderProperties) {
  const placeholderHeight = itemHeight ?? 69;

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

  const donateAmount = previousDonateAmount * 0.8;

  if (donorRank <= 2) {
    return (
      <>
        <li className="grid grid-cols-[10px,1fr,70px] items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5 md:grid-cols-[10px,1fr,100px]">
          <span className="text-neutral-600">{donorRank + 1}</span>
          <span className="flex items-center gap-x-1.5 text-neutral-900">
            {avatarPlaceholder}
            <span className="blur-sm">user.eth</span>
          </span>
          <span className="text-right text-neutral-900 blur-sm">
            $
            {donateAmount >= 0.01
              ? new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: donateAmount % 1 === 0 ? 0 : 2,
                  maximumFractionDigits: 2,
                }).format(Number(donateAmount ?? 0))
              : '<0.01'}
          </span>
        </li>

        {amountToDisplay - 1 - donorRank ? (
          <span
            style={{
              height: `${(amountToDisplay - 1 - donorRank) * placeholderHeight}px`,
            }}
            className="flex items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5 text-center text-label4 gradient-text-2"
          >
            {hideEncouragement
              ? null
              : `Donate now and claim ${rankPlaces[donorRank]} place`}
          </span>
        ) : null}
      </>
    );
  }

  return (
    <>
      {amountToDisplay - donorRank ? (
        <span
          style={{
            height: `${(amountToDisplay - donorRank) * placeholderHeight}px`,
          }}
          className="flex items-center justify-center border-b border-b-neutral-300"
        />
      ) : null}
    </>
  );
}
