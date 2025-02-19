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

type Properties = {
  className?: string;
  tipsLoading: boolean;
  validatedAddress?: string | null;
  tipEdges: { node: TipHistoryNode }[];
  updateCurrentContent: (content: 'tip' | 'history') => void;
};

const baseClassName =
  'z-1 w-[440px] max-w-full rounded-xl bg-white flex flex-col items-center relative overflow-hidden';

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
        tip.node.interpretation.descriptionDisplayItems[0]?.tokenV2.decimals ??
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
    <div className={classes(className, baseClassName)}>
      <div className="relative flex min-h-[100px] w-full items-center justify-center overflow-hidden">
        <img
          src={IDRISS_SCENE_STREAM_2.src}
          alt=""
          className="absolute -left-5 -top-1 h-[110px] w-[640px] max-w-none object-cover"
        />
        <span className="absolute left-0 top-0 size-full bg-black/20" />
        <h1 className="relative z-1 mx-12 my-6 text-center text-heading4 uppercase text-white">
          Top donors
        </h1>
      </div>
      <div className="flex w-full flex-col">
        {tipsLoading || !validatedAddress || !sortedGroupedTips ? (
          <span className="flex w-full items-center justify-center border-b border-b-neutral-300 px-5.5 py-4.5">
            <Spinner className="size-16 text-mint-600" />
          </span>
        ) : (
          <ul>
            {sortedGroupedTips.map((groupedTip, index) => {
              if (!groupedTip.tips[0] || index > 5) return null;

              return (
                <DonorItem
                  donorRank={index}
                  donateAmount={groupedTip.tipsSum}
                  donorDetails={groupedTip.user}
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
      <div className="flex min-h-[80px] w-full items-center justify-center">
        <Link
          size="xs"
          onClick={() => {
            updateCurrentContent('history');
          }}
          className={`mx-6 my-3 cursor-pointer ${sortedGroupedTips?.length === 0 ? 'invisible' : ''}`}
        >
          See full donation history
        </Link>
      </div>
    </div>
  );
};
