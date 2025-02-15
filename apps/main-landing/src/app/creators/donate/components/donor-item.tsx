import { Hex } from 'viem';

import { useGetEnsName } from '@/app/creators/donate-history/commands/get-ens-name';

import { default as RANK_1 } from '../assets/rank-1.png';
import { default as RANK_2 } from '../assets/rank-2.png';
import { default as RANK_3 } from '../assets/rank-3.png';

// TODO: IMPORTANT - those functions should be moved to packages/constants
const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
};

type Properties = {
  donorAddress: Hex;
  donorRank: number;
  donateAmount: number;
};

const rankImages = [RANK_1.src, RANK_2.src, RANK_3.src];
const rankPlaces = ['1st', '2nd', '3rd'];

export default function DonorItem({
  donorAddress,
  donorRank,
  donateAmount,
}: Properties) {
  const ensNameQuery = useGetEnsName({
    address: donorAddress,
  });

  const rankImage =
    donorRank <= 2 ? (
      <img src={rankImages[donorRank]} alt={`Rank ${donorRank + 1}`} />
    ) : (
      <span className="h-[32px] w-[29px]" />
    );

  return (
    <li className="grid grid-cols-[10px,1fr,70px] items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5 md:grid-cols-[10px,1fr,100px]">
      <span className="text-neutral-600">{donorRank + 1}</span>
      <span className="flex items-center gap-x-1.5 text-neutral-900">
        {rankImage}
        {ensNameQuery.data ?? getShortWalletHex(donorAddress)}
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
  const rankImage =
    donorRank <= 2 ? (
      <img src={rankImages[donorRank]} alt={`Rank ${donorRank + 1}`} />
    ) : (
      <span className="h-[32px] w-[29px]" />
    );

  const donateAmount = previousDonateAmount * 0.8;

  if (donorRank <= 2) {
    return (
      <>
        <li className="grid grid-cols-[10px,1fr,70px] items-center gap-x-3.5 border-b border-b-neutral-300 px-5.5 py-4.5 text-body5 md:grid-cols-[10px,1fr,100px]">
          <span className="text-neutral-600">{donorRank + 1}</span>
          <span className="flex items-center gap-x-1.5 text-neutral-900">
            {rankImage}
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
          className="flex items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5 text-center text-label5 text-neutral-500"
        >
          Donate now and claim {rankPlaces[donorRank]} place!
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
