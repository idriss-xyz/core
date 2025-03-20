import { EMPTY_HEX, hexSchema } from '@idriss-xyz/constants';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Icon } from '@idriss-xyz/ui/icon';
import { Hex } from 'viem';
import { getShortWalletHex, removeEthSuffix } from '@idriss-xyz/utils';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';

import { useGetDonorHistory } from '@/app/creators/donate/commands/get-donor-history';
import { LeaderboardTopDonors } from '@/app/creators/donate/top-donors';
import { backgroundLines4 } from '@/assets';
import { useGetEnsAvatar } from '@/app/creators/donate/commands/get-ens-avatar';
import { useGetEnsName } from '@/app/creators/donate/commands/get-ens-name';
import { DonateContentValues } from '@/app/creators/donate/types';

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-mint-100 px-4 pb-9 pt-9 flex flex-col items-center relative container mt-8 overflow-hidden lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]';

type Properties = {
  isStandalone?: boolean;
  isInvalidAddress?: boolean;
  validatedAddress?: string | null;
  currentContent: DonateContentValues;
  updateCurrentContent?: (content: DonateContentValues) => void;
};

export default function DonorStatsList({
  isStandalone,
  currentContent,
  isInvalidAddress,
  validatedAddress,
  updateCurrentContent,
}: Properties) {
  const userDetails = currentContent.userDetails;

  const addressValidationResult = hexSchema.safeParse(validatedAddress);
  const userAddress = addressValidationResult.success
    ? (validatedAddress as Hex)
    : userDetails?.address;

  const donorHistory = useGetDonorHistory(
    { address: userAddress ?? EMPTY_HEX },
    { enabled: !!userAddress },
  );

  const mostDonatedTo = donorHistory.data?.stats?.mostDonatedToAddress as Hex;

  const mostDonatedToEnsNameQuery = useGetEnsName(
    {
      address: mostDonatedTo ?? EMPTY_HEX,
    },
    { enabled: !!mostDonatedTo },
  );

  const mostDonatedToEnsAvatarQuery = useGetEnsAvatar(
    { name: mostDonatedToEnsNameQuery.data ?? '' },
    { enabled: !!mostDonatedToEnsNameQuery.data },
  );

  if (
    (!userDetails && !isStandalone) ||
    (!isStandalone && !donorHistory.isLoading && !donorHistory.data)
  ) {
    if (updateCurrentContent) {
      if (currentContent.previous) {
        updateCurrentContent(currentContent.previous);
      } else {
        updateCurrentContent({ name: 'user-tip' });
      }
    }

    return;
  }

  const stats = donorHistory.data?.stats;
  const leaderboard = donorHistory.data?.leaderboard;

  return (
    <div className="grid grid-cols-1 items-start gap-x-10 lg:grid-cols-[1fr,auto]">
      <div className={classes(baseClassName)}>
        <link rel="preload" as="image" href={backgroundLines4.src} />
        <img
          alt=""
          src={backgroundLines4.src}
          className="pointer-events-none absolute top-0 hidden size-full opacity-100 lg:block"
        />

        <div className="flex w-full items-center gap-x-2">
          {!isStandalone && (
            <IconButton
              asLink
              size="small"
              intent="tertiary"
              iconName="ArrowLeft"
              className="cursor-pointer"
              onClick={() => {
                if (updateCurrentContent) {
                  updateCurrentContent(
                    currentContent.previous ?? { name: 'user-tip' },
                  );
                }
              }}
            />
          )}
          <h1 className="text-heading4 text-neutralGreen-900">
            Donation stats{' '}
            {(stats?.donorDisplayName ?? userAddress) &&
              !isInvalidAddress &&
              ` of ${stats?.donorDisplayName ?? getShortWalletHex(userAddress ?? '')}`}
          </h1>
        </div>

        {!isInvalidAddress &&
          (donorHistory.isLoading || (!validatedAddress && !!isStandalone)) && (
            <Spinner className="mx-auto mt-9 size-16 text-mint-600" />
          )}

        {(donorHistory.isError ||
          (validatedAddress !== undefined &&
            addressValidationResult.error)) && (
          <div className="mx-auto mt-9">
            <p className="flex items-center justify-center gap-2 px-5.5 py-3 text-center text-heading4 text-red-500">
              <Icon name="AlertCircle" size={40} />{' '}
              <span>Cannot get donation stats</span>
            </p>
          </div>
        )}

        {isInvalidAddress && (
          <div className="mx-auto mt-9">
            <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
              <Icon name="AlertCircle" size={40} />
              <span>Wrong address</span>
            </p>
          </div>
        )}

        {stats &&
          !donorHistory.isLoading &&
          !donorHistory.isError &&
          !isInvalidAddress && (
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
                  <p className="text-label5 text-neutral-600">
                    Largest donation
                  </p>

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
                  <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md">
                    <p className="text-label5 text-neutral-600">
                      Favorite token
                    </p>

                    <span className="flex items-center justify-center gap-x-1">
                      <p className="text-heading4 text-neutral-800">
                        {stats.favoriteDonationToken}{' '}
                      </p>
                      <img
                        className="inline-block size-6 rounded-full"
                        src={stats.favoriteTokenMetadata.imageUrlV2}
                        alt=""
                      />
                    </span>
                  </div>
                )}

                {stats.mostDonatedToAddress !== '' && (
                  <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-7 shadow-md">
                    <p className="text-label5 text-neutral-600">
                      Top recipient
                    </p>

                    <div className="flex flex-row items-center gap-x-1">
                      {mostDonatedToEnsAvatarQuery.data ? (
                        <img
                          alt="Donor avatar"
                          src={mostDonatedToEnsAvatarQuery.data}
                          className="size-10 rounded-full border border-neutral-400"
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

                      <TooltipProvider delayDuration={400}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="cursor-default truncate text-label3 text-neutral-800">
                              {mostDonatedToEnsNameQuery.data
                                ? removeEthSuffix(
                                    mostDonatedToEnsNameQuery.data,
                                  )
                                : getShortWalletHex(stats.mostDonatedToAddress)}
                            </p>
                          </TooltipTrigger>

                          <TooltipContent className="w-fit bg-black text-white">
                            <p>
                              {mostDonatedToEnsNameQuery.data ??
                                stats.mostDonatedToAddress}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}

                {stats.positionInLeaderboard && (
                  <div className="flex flex-col items-center justify-center gap-y-2 rounded-2xl bg-white px-2 py-8 shadow-md">
                    <p className="text-label5 text-neutral-600">
                      Leaderboard rank
                    </p>

                    <p className="text-heading4 text-neutral-800">
                      #{stats.positionInLeaderboard}
                    </p>
                  </div>
                )}
              </div>

              {userAddress && (
                <div className="mt-12 flex justify-center">
                  <Link
                    size="xs"
                    onClick={() => {
                      if (updateCurrentContent) {
                        updateCurrentContent({
                          name: 'donor-history',
                          userDetails: { address: userAddress },
                        });
                      }
                    }}
                    className="cursor-pointer"
                  >
                    See full donation history
                  </Link>
                </div>
              )}
            </>
          )}
      </div>

      <LeaderboardTopDonors
        leaderboard={leaderboard ?? []}
        updateCurrentContent={updateCurrentContent}
        leaderboardError={
          donorHistory.isError ||
          (validatedAddress !== undefined && !!addressValidationResult.error)
        }
        leaderboardLoading={
          donorHistory.isLoading || (!validatedAddress && !!isStandalone)
        }
        className="container mt-8 w-[360px] max-w-full overflow-hidden px-0 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]"
      />
    </div>
  );
}
