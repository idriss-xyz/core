import * as RadixToast from '@radix-ui/react-toast';
import { Button } from '@idriss-xyz/ui/button';
import { useState } from 'react';

import { Icon, LazyImage, ToastWrapper } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';
import { GetEnsInfoCommand } from 'application/trading-copilot';

const exampleTradingCopilotToasts = [
  {
    details: {
      name: 'vitalik.eth',
      amount: 150,
      crypto: 'ETH',
      when: '15 mins ago',
    },
    open: true,
    dialogId: 'dialog1',
  },
  {
    details: {
      name: 'vitalikk.eth',
      amount: 300,
      crypto: 'ETH',
      when: '30 mins ago',
    },
    open: true,
    dialogId: 'dialog2',
  },
];

type TradingCopilotToastsProperties = {
  openDialog: (dialogId: string) => void;
};

export const TradingCopilotToasts = ({
  openDialog,
}: TradingCopilotToastsProperties) => {
  return (
    <ToastWrapper>
      {exampleTradingCopilotToasts.map((toast, index) => {
        return (
          <TradingCopilotToast
            key={index}
            toast={toast}
            openDialog={openDialog}
          />
        );
      })}
    </ToastWrapper>
  );
};

type TradingCopilotToastProperties = {
  toast: {
    details: {
      name: string;
      amount: number;
      crypto: string;
      when: string;
    };
    open: boolean;
    dialogId: string;
  };
  openDialog: (dialogId: string) => void;
};

const TradingCopilotToast = ({
  toast: { details, open, dialogId },
  openDialog,
}: TradingCopilotToastProperties) => {
  const [isOpen, setIsOpen] = useState(open);

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: details.name,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <RadixToast.Root
      open={isOpen}
      onSwipeEnd={() => {
        return setIsOpen(false);
      }}
      style={{
        transform: 'translate(var(--radix-toast-swipe-move-x), 0)',
      }}
    >
      <div className="rounded-xl border border-neutral-300 bg-white p-4">
        <div className="grid grid-cols-[48px,1fr] gap-2">
          <LazyImage
            src={avatarQuery.data}
            className="size-12 rounded-full border border-neutral-400 bg-neutral-200"
            fallbackComponent={
              <div className="flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
                <Icon
                  size={30}
                  name="PersonIcon"
                  className="text-neutral-500"
                />
              </div>
            }
          />
          <div className="flex w-full flex-col gap-y-1">
            <p className="text-label3 text-neutral-900">
              {details.name}{' '}
              <span className="text-body3 text-neutral-600">
                purchased {details.amount} {details.crypto}
              </span>
            </p>
            <div className="flex w-full justify-between">
              <p className="text-body6 text-mint-700">{details.when}</p>
              <Button
                intent="primary"
                size="small"
                className="uppercase"
                onClick={() => {
                  openDialog(dialogId);
                  setIsOpen(false);
                }}
              >
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RadixToast.Root>
  );
};
