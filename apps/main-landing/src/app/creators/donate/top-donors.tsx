import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { formatUnits } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import {
  hexSchema,
  TipHistoryFromUser,
  TipHistoryNode,
} from '@idriss-xyz/constants';
import { Icon } from '@idriss-xyz/ui/icon';

import { IDRISS_SCENE_STREAM_2 } from '@/assets';
import {
  default as DonorItem,
  DonorItemPlaceholder,
} from '@/app/creators/donate/components/donor-item';
import {
  donateContentValues,
  DonorHistoryResponse,
} from '@/app/creators/donate/types';

type Properties = {
  className?: string;
  tipsLoading: boolean;
  validatedAddress?: string | null;
  tipEdges: { node: TipHistoryNode }[];
  updateCurrentContent: (content: donateContentValues) => void;
};

const baseClassName =
  'z-1 w-[360px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

export const TopDonors = ({
  tipEdges,
  className,
  tipsLoading,
  validatedAddress,
  updateCurrentContent,
}: Properties) => {
  const addressValidationResult = hexSchema.safeParse(validatedAddress);

  const groupedTips = tipEdges?.reduce(
    (accumulator, tip) => {
      const userAddress = tip.node.transaction.fromUser.address;
      const user = tip.node.transaction.fromUser;
      const amountRaw =
        tip.node.interpretation.descriptionDisplayItems[0]?.amountRaw;
      const price =
        tip.node.interpretation.descriptionDisplayItems[0]?.tokenV2
          ?.onchainMarketData?.price;
      const decimals =
        tip.node.interpretation.descriptionDisplayItems[0]?.tokenV2?.decimals ??
        18;

      if (!amountRaw || !price) {
        return accumulator;
      }

      const tradeValue =
        Number.parseFloat(formatUnits(BigInt(amountRaw), decimals)) * price;

      if (!accumulator[userAddress]) {
        accumulator[userAddress] = {
          tips: [] as { node: TipHistoryNode }[],
          tipsSum: 0,
          user: user,
        };
      }

      accumulator[userAddress].tips.push(tip);
      accumulator[userAddress].tipsSum += tradeValue;

      return accumulator;
    },
    {} as Record<
      string,
      {
        tipsSum: number;
        user: TipHistoryFromUser;
        tips: { node: TipHistoryNode }[];
      }
    >,
  );

  const sortedGroupedTips = groupedTips
    ? Object.values(groupedTips).sort((a, b) => {
        return b.tipsSum - a.tipsSum;
      })
    : undefined;

  if (validatedAddress !== undefined && addressValidationResult.error) {
    return (
      <div className={classes(baseClassName, className, 'px-4 pb-9 pt-6')}>
        <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
          <Icon name="AlertCircle" size={40} /> <span>Wrong address</span>
        </p>
      </div>
    );
  }

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
          Top donors
        </h1>
      </div>

      <div className="flex w-full flex-col">
        {(tipsLoading || !validatedAddress || !sortedGroupedTips) && (
          <span className="flex w-full items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5">
            <Spinner className="size-16 text-mint-600" />
          </span>
        )}

        {!tipsLoading && validatedAddress && sortedGroupedTips && (
          <ul>
            {sortedGroupedTips.map((groupedTip, index) => {
              if (!groupedTip.tips[0] || index > 5) return null;

              return (
                <DonorItem
                  donorRank={index}
                  donorDetails={groupedTip.user}
                  donateAmount={groupedTip.tipsSum}
                  updateCurrentContent={updateCurrentContent}
                  key={`${groupedTip.tipsSum}${groupedTip.tips[0].node.transaction.hash}`}
                />
              );
            })}

            {sortedGroupedTips.length <= 5 ? (
              <DonorItemPlaceholder
                donorRank={sortedGroupedTips.length}
                previousDonateAmount={sortedGroupedTips.at(-1)?.tipsSum ?? 1234}
              />
            ) : null}
          </ul>
        )}
      </div>

      <div className="flex min-h-[74px] w-full items-center justify-center">
        <Link
          size="xs"
          onClick={() => {
            updateCurrentContent({ name: 'history' });
          }}
          className={classes(
            'mx-6 my-3 cursor-pointer lg:text-label7',
            sortedGroupedTips?.length === 0 && 'invisible',
          )}
        >
          See full donation history
        </Link>
      </div>
    </div>
  );
};

type FilteredProperties = {
  className?: string;
  leaderboardError: boolean;
  leaderboardLoading: boolean;
  leaderboard: DonorHistoryResponse['leaderboard'];
  updateCurrentContent: (content: donateContentValues) => void;
};

export const LeaderboardTopDonors = ({
  className,
  leaderboard,
  leaderboardError,
  leaderboardLoading,
  updateCurrentContent,
}: FilteredProperties) => {
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
          Top donors
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
          <ul>
            {leaderboard.map((leaderboardItem, index) => {
              if (!leaderboardItem || index > 5) return null;

              return (
                <DonorItem
                  donorRank={index}
                  className="py-[23.5px]"
                  donateAmount={leaderboardItem.totalAmount}
                  updateCurrentContent={updateCurrentContent}
                  donorDetails={leaderboardItem.donorMetadata}
                  key={`${leaderboardItem.address}${leaderboardItem.totalAmount}`}
                />
              );
            })}

            {leaderboard.length <= 5 ? (
              <DonorItemPlaceholder
                itemHeight={79}
                donorRank={leaderboard.length}
                previousDonateAmount={leaderboard.at(-1)?.totalAmount ?? 1234}
              />
            ) : null}
          </ul>
        )}
      </div>
    </div>
  );
};
