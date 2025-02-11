import { IconButton } from '@idriss-xyz/ui/icon-button';
import { formatEther, Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { backgroundLines2, backgroundLines3 } from '@/assets';
import { useGetEnsName } from '@/app/creators/tip-history/commands/get-ens-name';
import { TipHistoryResponse } from '@/app/creators/tip-history/types';
import { TipHistoryQuery } from '@/app/creators/tip-history/constants';

import TipHistoryItem from './tip-history-item';
import TipHistoryRankingItem from './tip-history-ranking-item';

type Properties = {
  address: string;
};

export default function TipHistoryList({ address }: Properties) {
  const [filterDescending, setFilterDescending] = useState(false);

  const { data: tips } = useQuery<TipHistoryResponse>(TipHistoryQuery, {
    variables: {
      addresses: [address],
      isSigner: false,
    },
  });

  const ensNameQuery = useGetEnsName({
    address: address as Hex,
  });

  const filteredTips = tips?.accountsTimeline.edges.filter((tip) => {
    return tip.node.app?.slug === 'idriss';
  });

  const groupedTips = filteredTips?.reduce(
    (accumulator, tip) => {
      const userAddress = tip.node.transaction.fromUser.address;
      const amountRaw =
        tip.node.interpretation.descriptionDisplayItems[0]?.amountRaw;
      const price =
        tip.node.interpretation.descriptionDisplayItems[0]?.tokenV2.marketData
          ?.price;

      if (!amountRaw || !price) {
        return accumulator;
      }

      const tradeValue =
        Number.parseFloat(formatEther(BigInt(amountRaw))) * price || 0;

      if (!accumulator[userAddress]) {
        accumulator[userAddress] = {
          tipsSum: 0,
          tips: [],
        };
      }

      accumulator[userAddress].tips.push(tip);
      accumulator[userAddress].tipsSum += tradeValue;

      return accumulator;
    },
    {} as Record<string, { tipsSum: number; tips: typeof filteredTips }>,
  );

  const sortedGroupedTips = groupedTips
    ? Object.values(groupedTips).sort((a, b) => {
        return b.tipsSum - a.tipsSum;
      })
    : undefined;

  const toggleFilterDescending = () => {
    setFilterDescending(!filterDescending);
  };

  return (
    <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#b5d8ae_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
      <link rel="preload" as="image" href={backgroundLines2.src} />
      <img
        alt=""
        src={backgroundLines2.src}
        className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
      />

      <div className="container relative my-8 flex max-w-[900px] flex-col items-center overflow-hidden rounded-xl bg-white px-3 py-6 lg:my-[130px] lg:[@media(max-height:800px)]:my-[60px]">
        <link rel="preload" as="image" href={backgroundLines3.src} />
        <img
          alt=""
          src={backgroundLines3.src}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
        />

        <div className="mb-6 grid w-full grid-cols-[1fr,44px] items-center gap-x-4">
          <div className="flex items-center">
            <IconButton
              asLink
              size="medium"
              href="/creators"
              intent="tertiary"
              iconName="ArrowLeft"
            />
            <h1 className="my-auto self-start text-balance text-heading4">
              History of tips received by {ensNameQuery.data ?? address}
            </h1>
          </div>
          <IconButton
            size="medium"
            intent="tertiary"
            iconName="ArrowDownWideNarrow"
            onClick={toggleFilterDescending}
            disabled={filteredTips && filteredTips.length <= 0}
          />
        </div>

        <div className="flex w-full flex-col gap-y-6 px-3">
          {filteredTips ? (
            filteredTips.length > 0 ? (
              sortedGroupedTips && filterDescending ? (
                sortedGroupedTips.map((groupedTip) => {
                  if (!groupedTip.tips[0]) {
                    return;
                  }

                  return (
                    <TipHistoryRankingItem
                      groupedTip={groupedTip}
                      key={`${groupedTip.tipsSum}${groupedTip.tips[0].node.transaction.hash}`}
                    />
                  );
                })
              ) : (
                filteredTips.map((edge) => {
                  return (
                    <TipHistoryItem
                      tip={edge.node}
                      key={edge.node.transaction.hash}
                    />
                  );
                })
              )
            ) : (
              <p>This address has not received any tips</p>
            )
          ) : (
            <Spinner className="mx-auto my-4 size-16" />
          )}
        </div>
      </div>
    </main>
  );
}
