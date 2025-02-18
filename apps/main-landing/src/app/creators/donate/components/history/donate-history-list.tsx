import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Icon } from '@idriss-xyz/ui/icon';

import DonateHistoryItem from '@/app/creators/donate/components/history/donate-history-item';

import { ZapperNode } from '../../types';

type Properties = {
  tipsLoading: boolean;
  isInvalidAddress: boolean;
  tipEdges: { node: ZapperNode }[];
  address: string | null | undefined;
  updateCurrentContent: (content: 'tip' | 'history') => void;
};

export default function DonateHistoryList({
  address,
  tipEdges,
  tipsLoading,
  isInvalidAddress,
  updateCurrentContent,
}: Properties) {
  return (
    <div className="container relative mt-8 flex w-[600px] max-w-full flex-col items-center gap-y-6 rounded-xl bg-white pb-4 pl-4 pt-2 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
      <div className="flex w-full items-center gap-x-2">
        <IconButton
          asLink
          size="medium"
          intent="tertiary"
          iconName="ArrowLeft"
          className="cursor-pointer"
          onClick={() => {
            updateCurrentContent('tip');
          }}
        />
        <h1 className="text-heading4">Donation history</h1>
      </div>

      <ScrollArea
        rootClassName="w-full max-h-[500px]"
        className="size-full max-h-[500px] overflow-y-auto transition-all duration-500"
      >
        {isInvalidAddress ? (
          <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
            <Icon name="AlertCircle" size={40} /> <span>Wrong address</span>
          </p>
        ) : (
          <div className="flex w-full flex-col gap-y-3 pr-5">
            {tipsLoading || !address ? (
              <Spinner className="mx-auto my-4 size-16 text-mint-600" />
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
        )}
      </ScrollArea>
    </div>
  );
}
