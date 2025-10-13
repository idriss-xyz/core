import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Icon } from '@idriss-xyz/ui/icon';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { DEMO_ADDRESS, LeaderboardStats } from '@idriss-xyz/constants';

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
  onDonorClick?: (displayName: string) => void;
  updateCurrentContent?: (content: DonateContentValues) => void;
  isScrollable?: boolean;
  style?: CSSProperties;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
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
  activeFilter,
  onFilterChange,
}: Properties) => {
  const isTwitchPanel = variant === 'panel';
  const isTwitchOverlay = variant === 'videoOverlay';
  const isTwitchComponent = variant === 'videoComponent';
  const isTwitchExtension =
    isTwitchPanel || isTwitchOverlay || isTwitchComponent;
  const isDonatePage = variant === 'donatePage';

  const isDemo = address.data === DEMO_ADDRESS;
  const [visibleLimit, setVisibleLimit] = useState(MAX_DISPLAYED_ITEMS);
  const listContainerReference = useRef<HTMLDivElement>(null);
  const listReference = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isTwitchExtension) return; // only for non-Twitch
    if (leaderboardLoading || address.isFetching) return;

    const recompute = () => {
      const container = listContainerReference.current;
      if (!container) return;

      const availableHeight = container.clientHeight;

      let rowHeight = 0;
      const listElement = listReference.current;
      if (listElement) {
        const firstRow = listElement.querySelector('li') as HTMLElement | null;
        if (firstRow) {
          rowHeight = Math.ceil(firstRow.getBoundingClientRect().height);
        }
      }

      if (!rowHeight || Number.isNaN(rowHeight)) {
        rowHeight = 72; // conservative fallback
      }

      const limit = Math.max(1, Math.floor(availableHeight / rowHeight));
      setVisibleLimit(limit);
    };

    const roContainer = new ResizeObserver(recompute);
    const roList = new ResizeObserver(recompute);

    if (listContainerReference.current)
      roContainer.observe(listContainerReference.current);
    if (listReference.current) roList.observe(listReference.current);

    requestAnimationFrame(recompute);

    return () => {
      roContainer.disconnect();
      roList.disconnect();
    };
  }, [
    leaderboardLoading,
    address.isFetching,
    leaderboard.length,
    isTwitchExtension,
  ]);

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
          'relative min-h-[100px] w-full overflow-hidden',
          isTwitchExtension && 'min-h-[85px]',
        )}
      >
        <img
          alt=""
          src={IDRISS_SCENE_STREAM_2.src}
          className="absolute -left-5 -top-1 h-[110px] w-[640px] max-w-none object-cover"
        />
        <span className="absolute left-0 top-0 size-full bg-black/20" />

        <h1
          className={classes(
            'relative z-1 mx-12 text-center text-heading4 uppercase text-white',
            isDonatePage ? 'mb-2 mt-5' : 'my-6',
          )}
        >
          Top fans
        </h1>
        {isDonatePage && (
          <div className="relative mx-auto flex w-[290px] items-center justify-center gap-1 text-label6">
            <span
              onClick={() => {
                return onFilterChange?.('All time');
              }}
              className={classes(
                'flex cursor-pointer justify-center rounded-full border border-mint-400 p-1.5',
                activeFilter === 'All time' ? 'bg-mint-400' : 'bg-white/80',
              )}
            >
              All time
            </span>
            <span
              onClick={() => {
                return onFilterChange?.('30 days');
              }}
              className={classes(
                'flex cursor-pointer justify-center rounded-full border border-mint-400 px-3 py-1',
                activeFilter === '30 days' ? 'bg-mint-400' : 'bg-white/80',
              )}
            >
              30 days
            </span>
            <span
              onClick={() => {
                return onFilterChange?.('7 days');
              }}
              className={classes(
                'flex cursor-pointer justify-center rounded-full border border-mint-400 px-3 py-1',
                activeFilter === '7 days' ? 'bg-mint-400' : 'bg-white/80',
              )}
            >
              7 days
            </span>
          </div>
        )}
      </div>

      <div
        className="flex min-h-0 w-full flex-1 flex-col"
        ref={listContainerReference}
      >
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
            ref={listReference}
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
                      isDemo={isDemo}
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
                {[0, 1, 2].map((rank) => {
                  const donor = leaderboard[rank];

                  if (donor) {
                    return (
                      <LeaderboardItem
                        donorRank={rank}
                        className="py-4.5"
                        isLastItem={rank === 2}
                        onDonorClick={onDonorClick}
                        donorDetails={{
                          address: donor.address,
                          avatarUrl: donor.avatarUrl,
                          displayName: donor.displayName,
                        }}
                        donateAmount={donor.totalAmount}
                        isTwitchExtension={isTwitchExtension}
                        isDemo={isDemo}
                        key={`donor-${donor.address}`}
                      />
                    );
                  }

                  /* missing slot → render placeholder for this exact rank */
                  return (
                    <LeaderboardItemPlaceholder
                      hideBottomBorder={rank === 2}
                      hideEncouragement
                      amountToDisplay={rank + 1} // prevents extra filler span
                      donorRank={rank}
                      previousDonateAmount={
                        leaderboard.at(-1)?.totalAmount ?? 1234
                      }
                      key={`placeholder-${rank}`}
                    />
                  );
                })}
              </>
            )}

            {!isTwitchExtension && (
              <>
                {leaderboard.map((item, index) => {
                  if (index > visibleLimit - 1) return null;

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
                      isDemo={isDemo}
                      key={`${item.totalAmount}${item.address}`}
                    />
                  );
                })}

                {leaderboard.length <= visibleLimit + 1 && (
                  <LeaderboardItemPlaceholder
                    amountToDisplay={visibleLimit + 1}
                    donorRank={leaderboard.length}
                    previousDonateAmount={
                      leaderboard.at(-1)?.totalAmount ?? 1234
                    }
                    hideBottomBorder={leaderboard.length >= visibleLimit}
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
  onDonorClick: (displayName: string) => void;
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
