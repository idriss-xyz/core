import type { CSSProperties } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Icon } from '@idriss-xyz/ui/icon';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { ColumnDefinition, Table } from '@idriss-xyz/ui/table';
import { DEMO_ADDRESS, LeaderboardStats } from '@idriss-xyz/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';
import { formatFiatValue } from '@idriss-xyz/utils';

import { IDRISS_SCENE_STREAM_2 } from '@/assets';

import { useAuth } from '../../context/auth-context';
import { WidgetVariants } from '../../../../../../twitch-extension/src/app/types';
import { DonateContentValues } from '../../donate/types';
import { useTimeAgo } from '../../donate/hooks/use-time-ago';
import { CopyButton } from '../copy-button/copy-button';

import {
  LeaderboardItem,
  LeaderboardItemPlaceholder,
} from './leaderboard-item';
import { LeaderboardItemDonor } from './leaderboard-item-donor';

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
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  title?: string;
  perspective?: 'creator' | 'donor';
  scope?: 'local' | 'global';
  isScrollable?: boolean;
  style?: CSSProperties;
};

const baseClassName =
  'z-1 w-[360px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

const TimeAgoCell = ({ timestamp }: { timestamp?: string | number }) => {
  const timeAgo = useTimeAgo({ timestamp });

  if (!timestamp) {
    return <>{timeAgo}</>;
  }

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{timeAgo}</span>
        </TooltipTrigger>
        <TooltipContent className="w-fit bg-black text-white">
          <p className="text-body6">
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
              .format(new Date(timestamp))
              .replaceAll('/', '-')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Leaderboard = ({
  variant,
  address,
  className,
  leaderboard = [],
  onDonorClick,
  leaderboardError,
  leaderboardLoading,
  updateCurrentContent,
  activeFilter,
  onFilterChange,
  title,
  perspective = 'donor',
  scope = 'local',
  isScrollable,
  style,
}: Properties) => {
  const { creator } = useAuth();

  const isDemo = address.data === DEMO_ADDRESS;
  const columns: ColumnDefinition<LeaderboardStats>[] = [
    {
      id: 'rank',
      name: '#',
      accessor: (_: LeaderboardStats, index: number) => {
        return index + 1;
      },
      className: 'w-[40px]',
    },
    {
      id: 'donor',
      name: perspective === 'creator' ? 'Creator' : 'Donor',
      accessor: (item, index) => {
        return (
          <LeaderboardItemDonor item={item} index={index} isDemo={isDemo} />
        );
      },
      className: 'flex items-center gap-x-1.5 overflow-hidden',
    },
    {
      id: 'totalAmount',
      name: perspective === 'creator' ? 'Total received' : 'Total donated',
      accessor: (item) => {
        return `${formatFiatValue(item.totalAmount)}`;
      },
      sortable: true,
      sortFunction: (a, b) => {
        return a.totalAmount - b.totalAmount;
      },
    },
    {
      id: 'donationCount',
      name: 'Donations',
      accessor: (item) => {
        return item.donationCount ?? 0;
      },
      sortable: true,
      sortFunction: (a, b) => {
        return (a.donationCount ?? 0) - (b.donationCount ?? 0);
      },
    },
    {
      id: 'donorSince',
      name: perspective === 'creator' ? 'Creator since' : 'Donor since',
      accessor: (item) => {
        return <TimeAgoCell timestamp={item.donorSince} />;
      },
      sortable: true,
      sortFunction: (a, b) => {
        const dateA = a.donorSince ? new Date(a.donorSince).getTime() : 0;
        const dateB = b.donorSince ? new Date(b.donorSince).getTime() : 0;
        return dateA - dateB;
      },
    },
  ];
  const isTwitchExtension = !!variant;
  const isTwitchPanel = variant === 'panel';
  const isTwitchOverlay = variant === 'videoOverlay';
  const isTwitchComponent = variant === 'videoComponent';
  const isCreatorsDashboard = variant === 'creatorsDashboard';
  const isDonatePage = variant === 'donatePage';

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
        isCreatorsDashboard && 'w-full',
        className,
      )}
      style={style}
    >
      <div
        className={classes(
          'relative min-h-[100px] w-full overflow-hidden',
          isTwitchExtension && 'min-h-[85px]',
          isCreatorsDashboard && 'min-h-[180px] w-full',
        )}
      >
        <img
          alt=""
          src={IDRISS_SCENE_STREAM_2.src}
          className={classes(
            'absolute -left-5 -top-1 h-[110px] w-[640px] max-w-none object-cover',
            isCreatorsDashboard && 'inset-0 h-full w-full',
          )}
        />
        <span className="absolute left-0 top-0 size-full bg-black/20" />

        <h1 className="relative z-1 mx-12 mb-4 mt-12 text-center text-heading4 uppercase text-white">
          {title ?? 'Top fans'}
        </h1>
        {(isCreatorsDashboard || isDonatePage) && (
          <div className="relative mx-auto flex w-[290px] gap-1 font-medium">
            <span
              onClick={() => {
                return onFilterChange?.('All time');
              }}
              className={classes(
                'flex w-[94px] cursor-pointer justify-center rounded-full border border-mint-400 p-1.5',
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
                'flex w-[94px] cursor-pointer justify-center rounded-full border border-mint-400 p-1.5',
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
                'flex w-[94px] cursor-pointer justify-center rounded-full border border-mint-400 p-1.5',
                activeFilter === '7 days' ? 'bg-mint-400' : 'bg-white/80',
              )}
            >
              7 days
            </span>
          </div>
        )}
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
          <div className={classes(isTwitchPanel && 'min-h-[345px]', 'h-full')}>
            {isCreatorsDashboard && (
              <ScrollArea className="h-[694px] w-full overflow-y-auto rounded-b-md rounded-t-none bg-white transition-all duration-500 [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
                <Table
                  columns={columns}
                  data={leaderboard}
                  className={classes(className, 'table-fixed')}
                  keyExtractor={(item) => {
                    return item.address;
                  }}
                  emptyState={
                    scope === 'global' ? (
                      <div className="mx-auto flex min-h-[694px] w-[477px] flex-col items-center justify-center gap-4">
                        <span className="text-center text-heading6 uppercase text-neutral-900">
                          No donations yet
                        </span>
                        <span className="mx-8 text-center text-display5 uppercase gradient-text">
                          change the time range to see results
                        </span>
                      </div>
                    ) : (
                      <div className="mx-auto flex min-h-[694px] w-[477px] flex-col items-center justify-center gap-4">
                        <span className="text-center text-heading6 uppercase text-neutral-900">
                          No fans yet
                        </span>
                        <span className="mx-8 text-center text-display5 uppercase gradient-text">
                          Share your page to get your first fan
                        </span>
                        <CopyButton
                          text={creator?.donationUrl ?? ''}
                          disabled={!creator?.donationUrl}
                        />
                      </div>
                    )
                  }
                />
              </ScrollArea>
            )}

            {isTwitchPanel && (
              <table className="w-full table-fixed border-collapse">
                <tbody>
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
                        key={item.address}
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
                </tbody>
              </table>
            )}

            {(isTwitchComponent || isTwitchOverlay) && (
              <table className="w-full table-fixed border-collapse">
                <tbody>
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
                        isDemo={isDemo}
                        key={item.address}
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
                </tbody>
              </table>
            )}

            {!isTwitchExtension &&
              (isScrollable ? (
                <ScrollArea className="h-full">
                  <table className="w-full table-fixed border-collapse">
                    <tbody>
                      {leaderboard.length > 0 ? (
                        leaderboard.map((item, index) => {
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
                              key={item.address}
                            />
                          );
                        })
                      ) : (
                        <LeaderboardItemPlaceholder
                          amountToDisplay={MAX_DISPLAYED_ITEMS + 1}
                          donorRank={leaderboard.length}
                          previousDonateAmount={1}
                        />
                      )}
                    </tbody>
                  </table>
                </ScrollArea>
              ) : (
                <table className="w-full table-fixed border-collapse">
                  <tbody>
                    {leaderboard.map((item, index) => {
                      if (index > MAX_DISPLAYED_ITEMS) return null;

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
                          key={item.address}
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
                  </tbody>
                </table>
              ))}
          </div>
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
