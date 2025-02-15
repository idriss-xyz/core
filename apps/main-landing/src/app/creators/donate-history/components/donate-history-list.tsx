import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Hex } from 'viem';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import DonateHistoryItem from '@/app/creators/donate-history/components/donate-history-item';

import { useGetTipHistory } from '../commands/get-donate-history';

type Properties = {
  address: string;
};

export default function DonateHistoryList({ address }: Properties) {
  const tips = useGetTipHistory({ address: address as Hex });
  const tipEdges = tips.data?.data ?? [];

  return (
    <div className="container relative mt-8 flex w-[600px] max-w-full flex-col items-center gap-y-6 rounded-xl bg-white pb-4 pl-4 pr-2 pt-2 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
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

      <ScrollArea
        rootClassName="w-full max-h-[500px]"
        className="size-full max-h-[500px] overflow-y-auto transition-all duration-500"
      >
        <div className="flex w-full flex-col gap-y-3 pr-2">
          {tips.isLoading ? (
            <Spinner className="mx-auto my-4 size-16" />
          ) : tipEdges.length > 0 ? (
            tipEdges.map((tip) => {
              return (
                <DonateHistoryItem
                  tip={tip.node}
                  key={tip.node.transaction.hash}
                />
              );
            })
          ) : (
            <p>This address has not received any tips</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
