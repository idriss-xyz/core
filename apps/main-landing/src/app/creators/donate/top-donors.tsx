import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { CREATORS_DONATE_LINK, hexSchema } from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';
import { Button } from '@idriss-xyz/ui/button';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { default as IDRISS_SCENE_STREAM_2 } from '../../../assets/idriss-scene-stream-2.png';
import { WidgetVariants } from '../../../../../twitch-extension/src/app/types';

import { LeaderboardStats, DonateContentValues } from './types';
import {
  default as DonorItem,
  DonorItemPlaceholder,
} from './components/donor-item';

type Properties = {
  heading?: string;
  className?: string;
  tipsLoading: boolean;
  variant?: WidgetVariants;
  donationUrl?: string | null;
  validatedAddress?: string | null;
  leaderboard: LeaderboardStats[];
  updateCurrentContent?: (content: DonateContentValues) => void;
  onDonorClick?: (address: Hex) => void;
};

const baseClassName =
  'z-1 w-[360px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

export const TopDonors = ({
  variant,
  leaderboard,
  className,
  tipsLoading,
  donationUrl,
  onDonorClick,
  validatedAddress,
  updateCurrentContent,
}: Properties) => {
  const donationURL =
    donationUrl ?? `${CREATORS_DONATE_LINK}?address=${validatedAddress}`;
  const addressValidationResult = hexSchema.safeParse(validatedAddress);

  const isTwitchExtension = variant !== null && variant !== undefined;
  const isTwitchPanel = variant === 'panel';
  const isTwitchOverlay = variant === 'videoOverlay';
  const isTwitchComponent = variant === 'videoComponent';

  if (validatedAddress !== undefined && addressValidationResult.error) {
    return (
      <div
        className={classes(
          baseClassName,
          'min-h-[500px] w-auto items-center justify-center px-4 pb-9 pt-6',
          className,
        )}
      >
        <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
          <Icon name="AlertCircle" size={40} />
          <span>Wrong address</span>
        </p>
      </div>
    );
  }

  return (
    <div
      className={classes(
        baseClassName,
        isTwitchExtension && 'w-[360px]',
        className,
      )}
    >
      <div
        className={classes(
          'relative flex min-h-[100px] w-full items-center justify-center overflow-hidden',
          isTwitchPanel && 'min-h-[83px]',
        )}
      >
        <img
          alt=""
          src={IDRISS_SCENE_STREAM_2.src}
          className="absolute -left-5 -top-1 h-[110px] w-[640px] max-w-none object-cover"
        />
        <span className="absolute left-0 top-0 size-full bg-black/20" />

        <h1 className="relative z-1 mx-12 my-6 text-center text-heading4 uppercase text-white">
          Top donors
        </h1>
      </div>

      <div className="flex w-full flex-col">
        {tipsLoading || !validatedAddress || !leaderboard ? (
          <span
            className={classes(
              'flex min-h-[207px] w-full items-center justify-center border-b-neutral-300 px-5.5 py-4.5',
              isTwitchPanel && 'min-h-[345px]',
            )}
          >
            <Spinner className="size-16 text-mint-600" />
          </span>
        ) : (
          <ul className={classes(isTwitchPanel && 'min-h-[345px]')}>
            {isTwitchPanel && (
              <>
                {leaderboard.map((item, index) => {
                  if (index > 4) return null;
                  return (
                    <DonorItem
                      donorRank={index}
                      onDonorClick={onDonorClick}
                      donorDetails={{
                        address: item.address,
                        displayName: item.displayName,
                        avatarUrl: item.avatarUrl,
                      }}
                      donateAmount={item.totalAmount}
                      isTwitchExtension={isTwitchExtension}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= 5 && (
                  <DonorItemPlaceholder
                    amountToDisplay={5}
                    donorRank={leaderboard.length}
                    previousDonateAmount={
                      leaderboard.at(-1)?.totalAmount ?? 1234
                    }
                  />
                )}
              </>
            )}

            {(isTwitchComponent || isTwitchOverlay) && (
              <>
                {leaderboard.map((item, index) => {
                  if (index > 2) return null;
                  return (
                    <DonorItem
                      donorRank={index}
                      onDonorClick={onDonorClick}
                      donorDetails={{
                        address: item.address,
                        displayName: item.displayName,
                        avatarUrl: item.avatarUrl,
                      }}
                      donateAmount={item.totalAmount}
                      isTwitchExtension={isTwitchExtension}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= 3 && (
                  <DonorItemPlaceholder
                    hideEncouragement
                    amountToDisplay={3}
                    donorRank={leaderboard.length}
                    previousDonateAmount={
                      leaderboard.at(-1)?.totalAmount ?? 1234
                    }
                  />
                )}
              </>
            )}

            {!isTwitchExtension && (
              <>
                {leaderboard.map((item, index) => {
                  if (index > 5) return null;
                  return (
                    <DonorItem
                      donorRank={index}
                      onDonorClick={onDonorClick}
                      donorDetails={{
                        address: item.address,
                        displayName: item.displayName,
                        avatarUrl: item.avatarUrl,
                      }}
                      donateAmount={item.totalAmount}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= 6 && (
                  <DonorItemPlaceholder
                    amountToDisplay={6}
                    donorRank={leaderboard.length}
                    previousDonateAmount={
                      leaderboard.at(-1)?.totalAmount ?? 1234
                    }
                  />
                )}
              </>
            )}
          </ul>
        )}
      </div>

      {isTwitchExtension && (
        <div
          className={classes(
            'flex min-h-[92px] w-full items-center justify-center px-5 py-3.5',
            isTwitchPanel && 'min-h-[72px]',
          )}
        >
          <Button
            asLink
            isExternal
            size="medium"
            intent="primary"
            className="w-full"
            href={donationURL}
          >
            {isTwitchPanel ? 'Donate' : 'Claim a spot'}
          </Button>
        </div>
      )}

      {updateCurrentContent && (
        <div className="flex min-h-[74px] w-full items-center justify-center">
          <Link
            size="xs"
            onClick={() => {
              updateCurrentContent({
                name: 'user-history',
              });
            }}
            className={classes(
              'mx-6 my-3 cursor-pointer lg:text-label7',
              leaderboard?.length === 0 && 'invisible',
            )}
          >
            See full donation history
          </Link>
        </div>
      )}
    </div>
  );
};

type LeaderboardProperties = {
  heading?: string;
  className?: string;
  leaderboardError: boolean;
  leaderboardLoading: boolean;
  onDonorClick: (address: Hex) => void;
  leaderboard: LeaderboardStats[];
};

export const LeaderboardTopDonors = ({
  heading,
  className,
  leaderboard,
  onDonorClick,
  leaderboardError,
  leaderboardLoading,
}: LeaderboardProperties) => {
  return (
    <div className={classes(baseClassName, className)}>
      <div className="relative flex min-h-[100px] w-full items-center justify-center overflow-hidden">
        <img
          alt=""
          src={IDRISS_SCENE_STREAM_2.src}
          className="absolute -left-5 -top-1 h-[110px] w-[640px] max-w-none object-cover"
        />
        <span className="absolute left-0 top-0 size-full bg-black/20" />

        <h1 className="relative z-1 mx-12 my-6 text-center text-heading4 uppercase text-white">
          {heading ?? 'Top donors'}
        </h1>
      </div>

      <div className="flex w-full flex-col">
        {leaderboardLoading && (
          <span className="flex w-full items-center justify-center px-5.5 py-4.5">
            <Spinner className="size-16 text-mint-600" />
          </span>
        )}

        {leaderboardError && (
          <p className="flex items-center justify-center gap-2 px-5.5 py-[30px] text-center text-heading4 text-red-500">
            <Icon name="AlertCircle" size={40} />{' '}
            <span>Cannot get leaderboard</span>
          </p>
        )}

        {leaderboard && !leaderboardLoading && !leaderboardError && (
          <ScrollArea className="max-h-[480px] overflow-y-auto transition-all duration-500">
            <ul className="flex flex-col pr-4">
              {leaderboard.map((leaderboardItem, index) => {
                if (!leaderboardItem || index > 9) return null;
                const isLastItem =
                  index === leaderboard.length - 1 || index === 9;
                return (
                  <DonorItem
                    donorRank={index}
                    isLastItem={isLastItem}
                    onDonorClick={onDonorClick}
                    className="max-w-[344px] py-[23.75px]"
                    donateAmount={leaderboardItem.totalAmount}
                    donorDetails={{
                      address: leaderboardItem.address,
                      displayName: leaderboardItem.displayName,
                      avatarUrl: leaderboardItem.avatarUrl,
                    }}
                    key={`${leaderboardItem.address}${leaderboardItem.totalAmount}`}
                  />
                );
              })}

              {leaderboard.length <= 5 ? (
                <DonorItemPlaceholder
                  itemHeight={79}
                  amountToDisplay={5}
                  donorRank={leaderboard.length}
                  previousDonateAmount={leaderboard.at(-1)?.totalAmount ?? 1234}
                />
              ) : null}
            </ul>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
