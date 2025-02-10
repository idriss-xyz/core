import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { useQuery } from '@apollo/client';

import { backgroundLines2, backgroundLines3 } from '@/assets';
import { useGetEnsName } from '@/app/creators/tip-history/commands/get-ens-name';
import { TipHistoryResponse } from '@/app/creators/tip-history/types';
import { TipHistoryQuery } from '@/app/creators/tip-history/constants';

import TipHistoryItem from './tip-history-item';

type Properties = {
  address: string;
};

export default function TipHistoryList({ address }: Properties) {
  const { data: tips } = useQuery<TipHistoryResponse>(TipHistoryQuery, {
    variables: {
      addresses: [address],
      isSigner: false,
    },
  });

  const ensNameQuery = useGetEnsName({
    address: address as Hex,
  });

  const filteredTips = tips?.accountsTimeline.edges;

  console.log(filteredTips);

  // tips?.accountsTimeline.edges.filter((tip) => {
  //     return (
  //       tip.node.interpretation.descriptionDisplayItems[1]?.account
  //         .address === address
  //     );
  //   });

  return (
    <main className="relative flex min-h-screen grow flex-col items-center justify-around gap-4 overflow-hidden bg-[radial-gradient(111.94%_122.93%_at_16.62%_0%,_#E7F5E7_0%,_#b5d8ae_100%)] px-2 pb-1 pt-[56px] lg:flex-row lg:items-start lg:justify-center lg:px-0">
      <link rel="preload" as="image" href={backgroundLines2.src} />
      <img
        alt=""
        src={backgroundLines2.src}
        className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
      />

      <div className="container relative my-8 flex max-w-[900px] flex-col items-center overflow-hidden rounded-xl bg-white px-1 pb-3 pt-6 lg:my-[130px] lg:[@media(max-height:800px)]:my-[60px]">
        <link rel="preload" as="image" href={backgroundLines3.src} />
        <img
          alt=""
          src={backgroundLines3.src}
          className="pointer-events-none absolute top-0 hidden h-full opacity-40 lg:block"
        />

        <div className="mb-6 flex w-full items-center">
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

        <div className="mb-6 flex w-full flex-col gap-y-6 px-3">
          {filteredTips ? (
            filteredTips.length > 0 ? (
              filteredTips.map((edge) => {
                return (
                  <TipHistoryItem
                    tip={edge.node}
                    key={edge.node.transaction.hash}
                  />
                );
              })
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
