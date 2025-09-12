import { useState, useEffect } from 'react';
import { EMPTY_HEX } from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import { getAddress, Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { useRouter } from 'next/navigation';

import { backgroundLines4 } from '@/assets';
import { DonateContentValues } from '@/app/creators/donate/types';

import { DonorHistoryStats } from '../types';
import { getCreatorNameAndPicOrAnon } from '../../utils';

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-mint-100 px-4 pb-9 pt-9 flex flex-col items-center relative container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]';

type Properties = {
  address: {
    isValid: boolean;
    data: Hex | null;
    isFetching: boolean;
  };
  statsError: boolean;
  statsLoading: boolean;
  stats?: DonorHistoryStats;
  updateCurrentContent?: (content: DonateContentValues) => void;
};

export default function DonorStatsList({
  stats,
  address,
  statsError,
  statsLoading,
  updateCurrentContent,
}: Properties) {
  const router = useRouter();

  const [mostDonatedToData, setMostDonatedToData] = useState<{
    profilePicUrl: string | undefined;
    name: string;
  }>({ profilePicUrl: undefined, name: 'anon' });

  useEffect(() => {
    if (
      stats?.mostDonatedToAddress &&
      stats?.mostDonatedToAddress !== EMPTY_HEX
    ) {
      void getCreatorNameAndPicOrAnon(
        getAddress(stats?.mostDonatedToAddress),
      ).then(setMostDonatedToData);
    }
  }, [stats?.mostDonatedToAddress]);

  return (
    <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[1fr,auto]">
      <div className={classes(baseClassName)}>
        <link rel="preload" as="image" href={backgroundLines4.src} />
        <img
          alt=""
          src={backgroundLines4.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-100 lg:block"
        />

        <h1 className="self-start text-heading4 text-neutralGreen-900">
          Donation stats of {stats?.donorDisplayName ?? 'anon'}
        </h1>

        {(address.isFetching || (address.isValid && statsLoading)) && (
          <Spinner className="mx-auto mt-9 size-16 text-mint-600" />
        )}

        {address.isValid && statsError && (
          <div className="mx-auto mt-9">
            <p className="flex items-center justify-center gap-2 px-5.5 py-3 text-center text-heading4 text-red-500">
              <Icon name="AlertCircle" size={40} />{' '}
              <span>Cannot get donation stats</span>
            </p>
          </div>
        )}

        {!address.isFetching && !address.isValid && (
          <div className="mx-auto mt-9">
            <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
              <Icon name="AlertCircle" size={40} />
              <span>Wrong address</span>
            </p>
          </div>
        )}

        {stats && (
          <>
            <div className="relative z-0 mb-[3px] mt-9 grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md">
                <p className="text-label5 text-neutral-600">Donations</p>

                <p className="text-heading4 text-neutral-800">
                  {stats.totalDonationsCount}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md">
                <p className="text-label5 text-neutral-600">Total volume</p>

                <p className="text-heading4 text-neutral-800">
                  $
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits:
                      stats.totalDonationAmount % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2,
                  }).format(Number(stats.totalDonationAmount))}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md">
                <p className="text-label5 text-neutral-600">Largest donation</p>

                <p className="text-heading4 text-neutral-800">
                  $
                  {new Intl.NumberFormat('en-US', {
                    minimumFractionDigits:
                      stats.biggestDonationAmount % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2,
                  }).format(Number(stats.biggestDonationAmount))}
                </p>
              </div>

              {stats.favoriteDonationToken && (
                <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md">
                  <p className="text-label5 text-neutral-600">Favorite token</p>

                  <span className="flex items-center justify-center gap-x-1">
                    <p className="text-heading4 text-neutral-800">
                      {stats.favoriteDonationToken}{' '}
                    </p>

                    {stats.favoriteTokenMetadata && (
                      <img
                        alt=""
                        src={stats.favoriteTokenMetadata.imageUrl}
                        className="inline-block size-6 rounded-full"
                      />
                    )}
                  </span>
                </div>
              )}

              {stats.mostDonatedToAddress !== EMPTY_HEX && (
                <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-7 shadow-md">
                  <p className="text-label5 text-neutral-600">Top recipient</p>

                  <div className="flex flex-row items-center gap-x-1">
                    {mostDonatedToData.profilePicUrl === undefined ? (
                      <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
                        <Icon
                          size={25}
                          name="CircleUserRound"
                          className="text-neutral-500"
                        />
                      </div>
                    ) : (
                      <img
                        alt="Donor avatar"
                        src={mostDonatedToData.profilePicUrl}
                        className="size-10 rounded-full border border-neutral-400"
                      />
                    )}

                    <TooltipProvider delayDuration={400}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="cursor-default truncate text-label3 text-neutral-800">
                            {mostDonatedToData.name}
                          </p>
                        </TooltipTrigger>

                        <TooltipContent className="w-fit bg-black text-white">
                          <p>
                            {mostDonatedToData.name ??
                              stats.mostDonatedToAddress}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}

              {stats.positionInLeaderboard && (
                <div
                  className="flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md"
                  onClick={() => {
                    router.push('/creators/donor/ranking');
                  }}
                >
                  <p className="text-label5 text-neutral-600">
                    Leaderboard rank
                  </p>

                  <p className="text-heading4 text-neutral-800">
                    #{stats.positionInLeaderboard}
                  </p>
                </div>
              )}
            </div>

            {!!stats.totalDonationsCount && (
              <div className="mt-12 flex justify-center">
                <Link
                  size="xs"
                  className="cursor-pointer"
                  onClick={() => {
                    if (updateCurrentContent) {
                      updateCurrentContent({
                        name: 'donor-history',
                      });
                    }
                  }}
                >
                  See full donation history
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
