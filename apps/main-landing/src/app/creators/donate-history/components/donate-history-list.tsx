import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';

import DonateHistoryItem from '@/app/creators/donate-history/components/donate-history-item';

import { useGetTipHistory } from '../commands/get-donate-history';

type Properties = {
  address: string;
};

export default function DonateHistoryList({ address }: Properties) {
  const tips = useGetTipHistory({
    address: address as Hex,
  });

  const filteredTips = tips.data?.accountsTimeline.edges.filter((tip) => {
    return tip.node.app?.slug === 'idriss';
  });

  return (
    <div className="container relative mt-8 flex w-[600px] max-w-full flex-col items-center gap-y-6 rounded-xl bg-white px-4 pb-4 pt-2 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
      <div className="flex w-full items-center gap-x-2">
        <IconButton
          asLink
          size="medium"
          href="/creators"
          intent="tertiary"
          iconName="ArrowLeft"
        />
        <h1 className="text-heading4">Donation history</h1>
      </div>

      <div className="flex w-full flex-col gap-y-3">
        {filteredTips ? (
          filteredTips.length > 0 ? (
            filteredTips.map((tip) => {
              return (
                <DonateHistoryItem
                  tip={tip.node}
                  key={tip.node.transaction.hash}
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
  );
}
