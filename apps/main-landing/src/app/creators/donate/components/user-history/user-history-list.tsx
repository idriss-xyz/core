import { IconButton } from '@idriss-xyz/ui/icon-button';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Icon } from '@idriss-xyz/ui/icon';
import { isAddress } from 'viem';
import { hexSchema, TipHistoryFromUser } from '@idriss-xyz/constants';

import { contentValues } from '../../page';

type Properties = {
  userDetails?: TipHistoryFromUser;
  backTo?: 'tip' | 'history' | 'userHistory';
  updateCurrentContent: (content: contentValues) => void;
};

export default function UserHistoryList({
  backTo,
  userDetails,
  updateCurrentContent,
}: Properties) {
  const addressValidationResult = hexSchema.safeParse(userDetails?.address);
  const isInvalidAddress =
    !!userDetails?.address &&
    (!addressValidationResult.success || !isAddress(userDetails?.address));

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
            updateCurrentContent({ name: backTo ?? 'tip' });
          }}
        />
        <h1 className="text-heading4">
          {userDetails?.displayName.value} Donation history
        </h1>
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
          <div className="flex w-full flex-col gap-y-3 pr-5 pt-1">
            <p>This address has not received any tips (waiting for ui & api)</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
