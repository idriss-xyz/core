import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { Icon } from '@idriss-xyz/ui/icon';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Button } from '@idriss-xyz/ui/button';
import { LeaderboardStats } from '@idriss-xyz/constants';
import { useState } from 'react';

import { IDRISS_SCENE_STREAM_2 } from '@/assets';

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
};

// Define sort types
type SortField = 'totalAmount' | 'donationCount' | 'donorSince';
type SortDirection = 'asc' | 'desc' | null;
type SortState = {
  field: SortField;
  direction: SortDirection;
};

const baseClassName =
  'z-1 w-[360px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

export const Leaderboard = ({
  variant,
  address,
  className,
  leaderboard,
  onDonorClick,
  leaderboardError,
  leaderboardLoading,
  updateCurrentContent,
}: Properties) => {
  const isTwitchExtension = !!variant;
  const isTwitchPanel = variant === 'panel';
  const isTwitchOverlay = variant === 'videoOverlay';
  const isTwitchComponent = variant === 'videoComponent';
  const isCreatorsDashboard = variant === 'creatorsDashboard';

  // State for sorting
  const [sortStates, setSortStates] = useState<SortState[]>([]);

  // Function to handle sort click
  const handleSort = (field: SortField) => {
    setSortStates((previousSortStates) => {
      // Find if this field is already being sorted
      const existingIndex = previousSortStates.findIndex((s) => {
        return s.field === field;
      });

      if (existingIndex >= 0) {
        // Field is already being sorted, cycle through directions
        const currentDirection = previousSortStates[existingIndex]?.direction;

        if (currentDirection === 'desc') {
          // Change to ascending
          const newSortStates = [...previousSortStates];
          newSortStates[existingIndex] = { field, direction: 'asc' };
          return newSortStates;
        } else {
          // Remove this sort
          return previousSortStates.filter((_, index) => {
            return index !== existingIndex;
          });
        }
      } else {
        // Add new sort with desc direction
        return [...previousSortStates, { field, direction: 'desc' }];
      }
    });
  };

  // Function to get sort direction for a field
  const getSortDirection = (field: SortField): SortDirection => {
    const sortState = sortStates.find((s) => {
      return s.field === field;
    });
    return sortState?.direction ?? null;
  };

  // Function to sort leaderboard data
  const getSortedLeaderboard = () => {
    if (sortStates.length === 0) return leaderboard;

    return [...leaderboard].sort((a, b) => {
      // Apply sorts in order they were added
      for (const { field, direction } of sortStates) {
        if (direction === null) continue;

        let comparison = 0;

        switch (field) {
          case 'totalAmount': {
            comparison = a.totalAmount - b.totalAmount;

            break;
          }
          case 'donationCount': {
            comparison = (a.donationCount ?? 0) - (b.donationCount ?? 0);

            break;
          }
          case 'donorSince': {
            // Assuming donorSince is a date string
            const dateA = a.donorSince ? new Date(a.donorSince).getTime() : 0;
            const dateB = b.donorSince ? new Date(b.donorSince).getTime() : 0;
            comparison = dateA - dateB;

            break;
          }
          // No default
        }

        // If this sort gives a non-zero result, return it with direction applied
        if (comparison !== 0) {
          return direction === 'asc' ? comparison : -comparison;
        }
      }

      // If all sorts are equal, maintain original order
      return 0;
    });
  };

  // Get sorted data
  const sortedLeaderboard = getSortedLeaderboard();

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
          Top donors
        </h1>
        {isCreatorsDashboard && (
          <div className="relative mx-auto flex w-[290px] gap-1 font-medium">
            <span className="flex w-[94px] justify-center rounded-full border border-mint-400 bg-mint-400 p-1.5">
              All time
            </span>
            <span className="flex w-[94px] justify-center rounded-full border border-mint-400 bg-white/80 p-1.5">
              30 days
            </span>
            <span className="flex w-[94px] justify-center rounded-full border border-mint-400 bg-white/80 p-1.5">
              7 days
            </span>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col">
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
          <div className={classes(isTwitchPanel && 'min-h-[345px]')}>
            {isCreatorsDashboard && (
              <ScrollArea className="max-h-[694px] w-full overflow-y-auto rounded-b-md rounded-t-none bg-white text-black transition-all duration-500 [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
                <table className="w-full table-auto border-collapse text-left">
                  <thead className="bg-neutral-100 text-label6">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        #
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Donor
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer select-none px-4 py-3"
                        onClick={() => {
                          return handleSort('totalAmount');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          Total donated
                          {getSortDirection('totalAmount') === 'desc' && (
                            <Icon name="ArrowDown" size={16} />
                          )}
                          {getSortDirection('totalAmount') === 'asc' && (
                            <Icon name="ArrowUp" size={16} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer select-none px-4 py-3"
                        onClick={() => {
                          return handleSort('donationCount');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          Donations
                          {getSortDirection('donationCount') === 'desc' && (
                            <Icon name="ArrowDown" size={16} />
                          )}
                          {getSortDirection('donationCount') === 'asc' && (
                            <Icon name="ArrowUp" size={16} />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="cursor-pointer select-none px-4 py-3"
                        onClick={() => {
                          return handleSort('donorSince');
                        }}
                      >
                        <div className="flex items-center gap-1">
                          Donor since
                          {getSortDirection('donorSince') === 'desc' && (
                            <Icon name="ArrowDown" size={16} />
                          )}
                          {getSortDirection('donorSince') === 'asc' && (
                            <Icon name="ArrowUp" size={16} />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedLeaderboard.map((item, index) => {
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
                          donorSince={item.donorSince}
                          donationCount={item.donationCount}
                          key={`${item.totalAmount}${item.address}`}
                        />
                      );
                    })}
                  </tbody>
                </table>
                {sortedLeaderboard.length === 0 && (
                  <div className="mx-auto flex min-h-[694px] w-[477px] flex-col items-center justify-center gap-4">
                    <span className="text-center text-heading6 uppercase text-neutral-900">
                      No donors yet
                    </span>
                    <span className="mx-8 text-center text-display5 uppercase gradient-text">
                      Share your page to get your first donor
                    </span>
                    <Button
                      size="medium"
                      intent="secondary"
                      onClick={() => {
                        return console.log('Not implemented yet');
                      }} // TODO: Add functionality
                      suffixIconName="IdrissArrowRight"
                      className="uppercase"
                    >
                      Copy link
                    </Button>
                  </div>
                )}
              </ScrollArea>
            )}

            {isTwitchPanel && (
              <table className="w-full table-auto border-collapse">
                <tbody>
                  {sortedLeaderboard.map((item, index) => {
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

                  {sortedLeaderboard.length <= MAX_DISPLAYED_ITEMS && (
                    <LeaderboardItemPlaceholder
                      hideBottomBorder
                      amountToDisplay={MAX_DISPLAYED_ITEMS}
                      donorRank={sortedLeaderboard.length}
                      previousDonateAmount={
                        sortedLeaderboard.at(-1)?.totalAmount ?? 1234
                      }
                    />
                  )}
                </tbody>
              </table>
            )}

            {(isTwitchComponent || isTwitchOverlay) && (
              <table className="w-full table-auto border-collapse">
                <tbody>
                  {sortedLeaderboard.map((item, index) => {
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

                  {sortedLeaderboard.length <= 3 && (
                    <LeaderboardItemPlaceholder
                      hideBottomBorder
                      hideEncouragement
                      amountToDisplay={3}
                      donorRank={sortedLeaderboard.length}
                      previousDonateAmount={
                        sortedLeaderboard.at(-1)?.totalAmount ?? 1234
                      }
                    />
                  )}
                </tbody>
              </table>
            )}

            {!isTwitchExtension && (
              <table className="w-full table-auto border-collapse">
                <tbody>
                  {sortedLeaderboard.map((item, index) => {
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
                        key={`${item.totalAmount}${item.address}`}
                      />
                    );
                  })}

                  {sortedLeaderboard.length <= MAX_DISPLAYED_ITEMS + 1 && (
                    <LeaderboardItemPlaceholder
                      amountToDisplay={MAX_DISPLAYED_ITEMS + 1}
                      donorRank={sortedLeaderboard.length}
                      previousDonateAmount={
                        sortedLeaderboard.at(-1)?.totalAmount ?? 1234
                      }
                    />
                  )}
                </tbody>
              </table>
            )}
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
  leaderboard,
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
            <table className="w-full table-auto border-collapse pr-4">
              <tbody>
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
                    itemHeight={79}
                    amountToDisplay={MAX_DISPLAYED_ITEMS}
                    donorRank={leaderboard.length}
                    previousDonateAmount={
                      leaderboard.at(-1)?.totalAmount ?? 1234
                    }
                  />
                )}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
