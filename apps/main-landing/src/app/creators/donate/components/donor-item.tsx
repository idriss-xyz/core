import { Icon } from '@idriss-xyz/ui/icon';

import { FromUser } from '@/app/creators/donate-history/types';
import { useGetEnsAvatar } from '@/app/creators/donate-history/commands/get-ens-avatar';

// TODO: IMPORTANT - those functions should be moved to packages/constants
const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
};

const rankBorders = [
  'border-[#FAC928]',
  'border-[#979797]',
  'border-[#934F0A]',
];
const rankColors = ['text-[#FAC928]', 'text-[#979797]', 'text-[#934F0A]'];
const rankPlaces = ['1st', '2nd', '3rd'];

type Properties = {
  donorRank: number;
  donateAmount: number;
  donorDetails: FromUser;
};

export default function DonorItem({
  donorRank,
  donateAmount,
  donorDetails,
}: Properties) {
  const displayName = donorDetails.displayName?.value;
  const nameSource = donorDetails.displayName?.source;

  const ensAvatarQuery = useGetEnsAvatar(
    { name: displayName ?? '' },
    { enabled: nameSource === 'ENS' && !!displayName },
  );

  const farcasterAvatarUrl =
    nameSource === 'FARCASTER' ? donorDetails.avatar?.value?.url : null;

  const avatarSource = ensAvatarQuery.data ?? farcasterAvatarUrl;

  const avatarImage = (
    <div className="relative w-max">
      {avatarSource ? (
        <img
          src={avatarSource}
          alt={`Rank ${donorRank + 1}`}
          className={`size-8 rounded-full bg-neutral-200 ${donorRank <= 2 ? `border-2 ${rankBorders[donorRank]}` : 'border border-neutral-400'}`}
        />
      ) : (
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
    <li className="grid grid-cols-[10px,1fr,70px] items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5 md:grid-cols-[10px,1fr,100px]">
      <span className="text-neutral-600">{donorRank + 1}</span>
      <span className="flex items-center gap-x-1.5 text-neutral-900">
        {avatarImage}
        {displayName ?? getShortWalletHex(donorDetails.address)}
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
  previousDonateAmount: number;
};

export function DonorItemPlaceholder({
  donorRank,
  previousDonateAmount,
}: PlaceholderProperties) {
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
        <span
          style={{ height: `${(5 - donorRank) * 69}px` }}
          className="flex items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5 text-center text-label4 gradient-text-2"
        >
          Donate now and claim {rankPlaces[donorRank]} place
        </span>
      </>
    );
  }

  return (
    <span
      style={{ height: `${(6 - donorRank) * 69}px` }}
      className="flex items-center justify-center border-b border-b-neutral-300"
    />
  );
}
