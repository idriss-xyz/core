import { formatEther } from 'viem';

import { IDRISS_ICON_CIRCLE } from '@/assets';
import { useGetEnsName } from '@/app/creators/tip-history/commands/get-ens-name';
import { useGetEnsAvatar } from '@/app/creators/tip-history/commands/get-ens-avatar';
import { Node } from '@/app/creators/tip-history/types';

const roundToSignificantFigures = (
  number: number,
  significantFigures: number,
): number | string => {
  if (number === 0) {
    return 0;
  }

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(significantFigures)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(significantFigures)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(significantFigures)}K`;
  }

  const multiplier = Math.pow(
    10,
    significantFigures - Math.floor(Math.log10(Math.abs(number))) - 1,
  );

  return Math.round(number * multiplier) / multiplier;
};

type Properties = {
  groupedTip: {
    tipsSum: number;
    tips: { node: Node }[];
  };
};

export default function TipHistoryRankingItem({ groupedTip }: Properties) {
  const tipperFromAddress =
    groupedTip.tips[0]?.node.transaction.fromUser.address;

  const ensNameQuery = useGetEnsName({
    address: tipperFromAddress ?? '0x',
  });

  const ensAvatarQuery = useGetEnsAvatar(
    {
      name: ensNameQuery.data ?? '',
    },
    {
      enabled: !!ensNameQuery.data,
    },
  );

  return (
    <div className="grid w-full grid-cols-[6fr,4fr] items-center gap-x-6">
      <div className="z-1 flex w-full items-start gap-x-2 rounded-xl bg-white p-4 shadow-lg">
        <div className="flex shrink-0 items-center justify-center">
          <img
            className={`size-12 rounded-full ${
              ensAvatarQuery.data ? 'border border-neutral-400' : ''
            }`}
            src={ensAvatarQuery.data ?? IDRISS_ICON_CIRCLE.src}
            alt={ensAvatarQuery.data ? 'Donor avatar' : 'IDRISS logo'}
          />
        </div>

        <div className="flex flex-col justify-center gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="text-label3 text-neutral-900">
              {ensNameQuery.data ?? tipperFromAddress}{' '}
            </p>
          </div>

          <p className="align-middle text-body5 text-neutral-600">
            Tipped sum of $
            {groupedTip.tipsSum >= 0.01
              ? roundToSignificantFigures(groupedTip.tipsSum, 2)
              : '<0.01'}{' '}
            in {groupedTip.tips.length}{' '}
            {groupedTip.tips.length === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-y-2 text-body5">
        {groupedTip.tips.map((tip) => {
          if (!tip.node.interpretation.descriptionDisplayItems[0]) {
            return;
          }

          return (
            <span key={tip.node.transaction.hash}>
              {formatEther(
                BigInt(
                  tip.node.interpretation.descriptionDisplayItems[0].amountRaw,
                ),
              )}{' '}
              {
                tip.node.interpretation.descriptionDisplayItems[0].tokenV2
                  .symbol
              }{' '}
              <span className="align-text-top text-body7">
                (
                {new Date(tip.node.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
                )
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
