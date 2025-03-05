import { EMPTY_HEX, TipHistoryFromUser } from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import { Hex } from 'viem';
import { getShortWalletHex } from '@idriss-xyz/utils';

import { useGetDonorHistory } from '@/app/creators/donate/commands/get-donor-history';
import { FilteredTopDonors } from '@/app/creators/donate/top-donors';
import { backgroundLines4 } from '@/assets';
import { useGetEnsAvatar } from '@/app/creators/donate/commands/get-ens-avatar';
import { useGetEnsName } from '@/app/creators/donate/commands/get-ens-name';

import { contentValues } from '../../page';

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-mint-100 px-4 pb-9 pt-9 flex flex-col items-center relative container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]';

type Properties = {
  userDetails?: TipHistoryFromUser;
  backTo?: 'tip' | 'history' | 'userHistory';
  updateCurrentContent: (content: contentValues) => void;
};

export default function UserHistoryList({
  backTo,
  userDetails,
  updateCurrentContent,
}: Properties) {
  const donorHistory = useGetDonorHistory(
    { address: userDetails?.address ?? EMPTY_HEX },
    { enabled: !!userDetails },
  );

  const ensNameQuery = useGetEnsName(
    {
      address:
        (donorHistory.data?.stats?.mostDonatedToAddress as Hex) ?? EMPTY_HEX,
    },
    { enabled: !!donorHistory.data?.stats?.mostDonatedToAddress },
  );

  const ensAvatarQuery = useGetEnsAvatar(
    { name: ensNameQuery.data ?? '' },
    { enabled: !!ensNameQuery.data },
  );

  if (!donorHistory.data || !userDetails) {
    if (backTo) {
      updateCurrentContent({ name: backTo });
    } else {
      updateCurrentContent({ name: 'tip' });
    }

    return;
  }

  console.log(donorHistory.data);

  const stats = donorHistory.data.stats;
  const leaderboard = donorHistory.data.leaderboard;

  console.log(stats);
  console.log(leaderboard);

  return (
    <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[1fr,auto]">
      <div className={classes(baseClassName)}>
        <link rel="preload" as="image" href={backgroundLines4.src} />
        <img
          src={backgroundLines4.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-100 lg:block"
          alt=""
        />

        <h1 className="self-start text-heading4 text-neutralGreen-900">
          Donation stats of{' '}
          {stats.donorDisplayName ?? userDetails.displayName.value}
        </h1>

        <div className="relative z-0 mt-9 grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-8 shadow-md">
            <p className="text-label5 text-neutral-600">Donations</p>
            <p className="text-heading4 text-neutral-800">
              {stats.totalDonationsCount}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-8 shadow-md">
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
          <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-8 shadow-md">
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
          {stats.favoriteTokenMetadata && (
            <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-8 shadow-md">
              <p className="text-label5 text-neutral-600">Favorite token</p>
              <p className="text-heading4 text-neutral-800">
                {stats.favoriteDonationToken}{' '}
                <img
                  className="inline-block size-6 rounded-full"
                  src={stats.favoriteTokenMetadata.imageUrlV2}
                  alt=""
                />
              </p>
            </div>
          )}
          {stats.mostDonatedToAddress !== '' && (
            <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-8 shadow-md">
              <p className="text-label5 text-neutral-600">Top recipient</p>
              <div className="flex flex-row items-center gap-x-1">
                {ensAvatarQuery.data ? (
                  <img
                    className="size-10 rounded-full border border-neutral-400"
                    src={ensAvatarQuery.data}
                    alt="Donor avatar"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
                    <Icon
                      size={25}
                      name="CircleUserRound"
                      className="text-neutral-500"
                    />
                  </div>
                )}
                <p className="text-label3 text-neutral-800">
                  {ensNameQuery.data ??
                    getShortWalletHex(stats.mostDonatedToAddress)}
                </p>
              </div>
            </div>
          )}
          {stats.positionInLeaderboard && (
            <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white p-8 shadow-md">
              <p className="text-label5 text-neutral-600">Leaderboard rank</p>
              <p className="text-heading4 text-neutral-800">
                #{stats.positionInLeaderboard}
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            size="xs"
            onClick={() => {
              updateCurrentContent({ name: 'history' });
            }}
            className="cursor-pointer"
          >
            See full donation history
          </Link>
        </div>
      </div>

      <FilteredTopDonors
        leaderboard={leaderboard}
        leaderboardLoading={donorHistory.isLoading}
        leaderboardError={donorHistory.isError}
        updateCurrentContent={updateCurrentContent}
        className="container mt-8 w-[360px] max-w-full overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
      />
    </div>
  );
}
