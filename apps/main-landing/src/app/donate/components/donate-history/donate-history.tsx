import { IconButton } from '@idriss-xyz/ui/icon-button';
import { Spinner } from '@idriss-xyz/ui/spinner';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Icon } from '@idriss-xyz/ui/icon';
import { StoredDonationData } from '@idriss-xyz/constants';

import { DonateContentValues } from '@/app/donate/types';

import { DonateHistoryItem } from './donate-history-item';

type Properties = {
  showReceiver?: boolean;
  donationsError: boolean;
  donationsLoading: boolean;
  donations: StoredDonationData[];
  currentContent: DonateContentValues;
  updateCurrentContent: (content: DonateContentValues) => void;
};
export const DonateHistory = ({
  donations,
  showReceiver,
  donationsError,
  currentContent,
  donationsLoading,
  updateCurrentContent,
}: Properties) => {
  const sortedDonations = [...donations].sort((a, b) => {
    return b.timestamp - a.timestamp;
  });

  return (
    <div className="container relative mt-8 flex w-[600px] max-w-full flex-col items-center gap-y-5 rounded-xl bg-white pb-4 pl-4 pr-1 pt-2 lg:mt-[130px] lg:[@media(max-height:800px)]:mt-[60px]">
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
        {donationsLoading && (
          <Spinner className="mx-auto my-4 size-16 text-mint-600" />
        )}

        {donationsError && (
          <p className="flex items-center justify-center gap-2 text-center text-heading4 text-red-500">
            <Icon name="AlertCircle" size={40} />{' '}
            <span>Cannot get donation list</span>
          </p>
        )}

        {!donationsLoading && (
          <div className="flex w-full flex-col gap-y-3 pr-5 pt-1">
            {sortedDonations.length > 0 ? (
              sortedDonations.map((donation) => {
                return (
                  <DonateHistoryItem
                    donation={donation}
                    showReceiver={showReceiver}
                    key={donation.transactionHash}
                  />
                );
              })
            ) : (
              <p>
                {showReceiver
                  ? 'No donations were sent from this address'
                  : 'This address has not received any donations'}
              </p>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
