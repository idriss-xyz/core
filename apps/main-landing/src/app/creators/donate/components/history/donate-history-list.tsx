import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Icon } from '@idriss-xyz/ui/icon';
import { Hex } from 'viem';

import { DonateContentValues, DonationData } from '@/app/creators/donate/types';

import DonateHistoryItem from './donate-history-item';

type Properties = {
  address: {
    isValid: boolean;
    data: Hex | null;
    isFetching: boolean;
  };
  tipsLoading: boolean;
  showReceiver?: boolean;
  currentContent: DonateContentValues;
  donations: DonationData[];
  updateCurrentContent: (content: DonateContentValues) => void;
};
export default function DonateHistoryList({
  address,
  donations,
  tipsLoading,
  showReceiver,
  currentContent,
  updateCurrentContent,
}: Properties) {
  const sortedTipEdges = [...donations].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="container relative mt-8 flex w-[600px] max-w-full flex-col items-center gap-y-5 rounded-xl bg-white pb-4 pl-4 pt-2 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
      <div className="flex w-full items-center gap-x-2">
        <IconButton
          asLink
          size="medium"
          intent="tertiary"
          iconName="ArrowLeft"
          className="cursor-pointer"
          onClick={() => {
            updateCurrentContent(
              currentContent.previous ?? { name: 'user-tip' },
            );
          }}
        />
        <h1 className="text-heading4">Donation history</h1>
      </div>

      <ScrollArea
        rootClassName="w-full max-h-[500px]"
        className="size-full max-h-[500px] overflow-y-auto transition-all duration-500"
      >
        {address.isValid ? (
          <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
            <Icon name="AlertCircle" size={40} /> <span>Wrong address</span>
          </p>
        ) : (
          <div className="flex w-full flex-col gap-y-3 pr-5 pt-1">
            {tipsLoading || !address ? (
              <Spinner className="mx-auto my-4 size-16 text-mint-600" />
            ) : sortedTipEdges.length > 0 ? (
              sortedTipEdges.map((tip) => {
                return (
                  <DonateHistoryItem
                    tip={tip}
                    showReceiver={showReceiver}
                    key={tip.transactionHash}
                  />
                );
              })
            ) : (
              <p>
                {showReceiver
                  ? 'No tips were sent from this address'
                  : 'This address has not received any tips'}
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
