import type { CSSProperties } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Icon } from '@idriss-xyz/ui/icon';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { LeaderboardStats } from '@idriss-xyz/constants';

import { default as IDRISS_SCENE_STREAM_2 } from '../../../../../assets/idriss-scene-stream-2.png';
import { WidgetVariants } from '../../../../../../../twitch-extension/src/app/types';
import { DonateContentValues } from '../../types';

import {
  LeaderboardItem,
  LeaderboardItemPlaceholder,
} from './leaderboard-item';

const MAX_DISPLAYED_ITEMS = 6;

type Properties = {
  className?: string;
  address: {
    isValid: boolean;
    data: Hex | null;
    isFetching: boolean;
  };
  variant?: WidgetVariants;
  leaderboardError: boolean;
  leaderboardLoading: boolean;
  leaderboard: LeaderboardStats[];
  onDonorClick?: (address: Hex) => void;
  updateCurrentContent?: (content: DonateContentValues) => void;
  isScrollable?: boolean;
  style?: CSSProperties;
};

const baseClassName =
  'z-1 w-[440px] lg:w-[360px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

export const Leaderboard = ({
  variant,
  address,
  className,
  leaderboard = [],
  onDonorClick,
  leaderboardError,
  leaderboardLoading,
  updateCurrentContent,
  style,
}: Properties) => {
  const isTwitchExtension = !!variant;
  const isTwitchPanel = variant === 'panel';
  const isTwitchOverlay = variant === 'videoOverlay';
  const isTwitchComponent = variant === 'videoComponent';

  if (!address.isFetching && !address.isValid) {
    return (
      <div
        className={classes(
          baseClassName,
          'min-h-[430px] w-auto items-center justify-center px-4 pb-9 pt-6',
          className,
          'px-4',
        )}
      >
        <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
          <Icon name="AlertCircle" size={40} />
          <span>Wrong address</span>
        </p>
      </div>
    );
  }

  if (leaderboardError) {
    return (
      <div
        className={classes(
          baseClassName,
          'min-h-[500px] w-auto items-center justify-center pb-9 pt-6',
          className,
          'px-4',
        )}
      >
        <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
          <Icon name="AlertCircle" size={40} />
          <span>Cannot get leaderboard</span>
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
      style={style}
    >
      <div
        className={classes(
          'relative flex min-h-[100px] w-full items-center justify-center overflow-hidden',
          isTwitchExtension && 'min-h-[85px]',
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

      <div className="flex min-h-0 w-full flex-1 flex-col">
        {leaderboardLoading || address.isFetching ? (
          <span
            className={classes(
              'flex min-h-[207px] w-full items-center justify-center border-b-neutral-300 px-5.5 py-4.5',
              isTwitchPanel && 'min-h-[345px]',
            )}
          >
            <Spinner className="size-16 text-mint-600" />
          </span>
        ) : (
          <ul
            className={classes(
              isTwitchPanel && 'min-h-[345px]',
              'h-full',
              'flex',
              'flex-col',
            )}
          >
            {isTwitchPanel && (
              <>
                {leaderboard.map((item, index) => {
                  if (index > 4) return null;

                  return (
                    <LeaderboardItem
                      donorRank={index}
                      className="py-4.5"
                      isLastItem={index === MAX_DISPLAYED_ITEMS - 1}
                      onDonorClick={onDonorClick}
                      donorDetails={{
                        address: item.address,
                        avatarUrl: item.avatarUrl,
                        displayName: item.displayName,
                      }}
                      donateAmount={item.totalAmount}
                      isTwitchExtension={isTwitchExtension}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= MAX_DISPLAYED_ITEMS && (
                  <LeaderboardItemPlaceholder
                    hideBottomBorder
                    amountToDisplay={MAX_DISPLAYED_ITEMS}
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
                    <LeaderboardItem
                      donorRank={index}
                      className="py-4.5"
                      isLastItem={index === 3}
                      onDonorClick={onDonorClick}
                      donorDetails={{
                        address: item.address,
                        avatarUrl: item.avatarUrl,
                        displayName: item.displayName,
                      }}
                      donateAmount={item.totalAmount}
                      isTwitchExtension={isTwitchExtension}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= 3 && (
                  <LeaderboardItemPlaceholder
                    hideBottomBorder
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
                  if (index > MAX_DISPLAYED_ITEMS - 1) return null;

                  return (
                    <LeaderboardItem
                      donorRank={index}
                      onDonorClick={onDonorClick}
                      donorDetails={{
                        address: item.address,
                        avatarUrl: item.avatarUrl,
                        displayName: item.displayName,
                      }}
                      donateAmount={item.totalAmount}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= MAX_DISPLAYED_ITEMS + 1 && (
                  <LeaderboardItemPlaceholder
                    amountToDisplay={MAX_DISPLAYED_ITEMS + 1}
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

      {updateCurrentContent && (
        <div className="flex min-h-[68px] w-full items-center justify-center">
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

type StandaloneProperties = {
  heading?: string;
  className?: string;
  leaderboardError: boolean;
  leaderboardLoading: boolean;
  leaderboard: LeaderboardStats[];
  onDonorClick: (address: Hex) => void;
};

export const LeaderboardStandalone = ({
  heading,
  className,
  leaderboard = [],
  onDonorClick,
  leaderboardError,
  leaderboardLoading,
}: StandaloneProperties) => {
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
          {heading ?? 'Leaderboard'}
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
                  <LeaderboardItem
                    donorRank={index}
                    isLastItem={isLastItem}
                    onDonorClick={onDonorClick}
                    className="max-w-[344px] py-[23.75px]"
                    donateAmount={leaderboardItem.totalAmount}
                    donorDetails={{
                      address: leaderboardItem.address,
                      avatarUrl: leaderboardItem.avatarUrl,
                      displayName: leaderboardItem.displayName,
                    }}
                    key={`${leaderboardItem.address}${leaderboardItem.totalAmount}`}
                  />
                );
              })}

              {leaderboard.length <= MAX_DISPLAYED_ITEMS && (
                <LeaderboardItemPlaceholder
                  amountToDisplay={MAX_DISPLAYED_ITEMS}
                  donorRank={leaderboard.length}
                  previousDonateAmount={leaderboard.at(-1)?.totalAmount ?? 1234}
                />
              )}
            </ul>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
