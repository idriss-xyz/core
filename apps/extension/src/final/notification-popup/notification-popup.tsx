import { useEffect, useState } from 'react';

import { useNotification } from 'shared/ui';
import { onWindowMessage, SWAP_EVENT } from 'shared/messaging';
import { SwapData } from 'application/trading-copilot';

import { TradingCopilotToast, TradingCopilotDialog } from './components';

const exampleTradingCopilotToasts = [
  {
    details: {
      name: 'vitalik.eth',
      amount: 150,
      crypto: 'ETH',
      when: '20 mins ago',
    },
    popupId: 'popup01',
    dialogId: 'dialog01',
  },
  {
    details: {
      name: 'levertz.eth',
      amount: 45,
      crypto: 'ETH',
      when: '33 mins ago',
    },
    popupId: 'popup02',
    dialogId: 'dialog02',
  },
  {
    details: {
      name: 'vitalikk.eth',
      amount: 76,
      crypto: 'ETH',
      when: '52 mins ago',
    },
    popupId: 'popup03',
    dialogId: 'dialog03',
  },
];

const exampleTradingCopilotDialogs = [
  {
    details: {
      name: 'vitalik.eth',
      amount: 150,
      crypto: 'ETH',
      when: '20 mins ago',
    },
    user: {
      balance: 200,
      crypto: 'ETH',
    },
    id: 'dialog01',
  },
  {
    details: {
      name: 'levertz.eth',
      amount: 45,
      crypto: 'ETH',
      when: '33 mins ago',
    },
    user: {
      balance: 200,
      crypto: 'ETH',
    },
    id: 'dialog02',
  },
  {
    details: {
      name: 'vitalikk.eth',
      amount: 76,
      crypto: 'ETH',
      when: '52 mins ago',
    },
    user: {
      balance: 200,
      crypto: 'ETH',
    },
    id: 'dialog03',
  },
];

export const NotificationPopup = () => {
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null);
  const activeDialogData = exampleTradingCopilotDialogs.find((dialogData) => {
    return dialogData.id === activeDialogId;
  });
  const notification = useNotification();

  onWindowMessage(SWAP_EVENT, (data: SwapData) => {
    const id = data.transactionId;

    const toast = {
      details: {
        name: 'test',
        amount: data.tokenOut.amount,
        crypto: data.tokenOut.symbol,
        when: '15 mins ago',
      },
      dialogId: `dialog${id}`,
      popupId: `toast${id}`,
    };

    notification.show(
      <TradingCopilotToast
        toast={toast.details}
        dialogId={toast.dialogId}
        openDialog={openDialog}
      />,
      'bottom-right',
      toast.popupId,
    );
  });

  const openDialog = (dialogId: string) => {
    setActiveDialogId(dialogId);
  };

  const closeDialog = () => {
    setActiveDialogId(null);
  };

  useEffect(() => {
    exampleTradingCopilotToasts.map((toast) => {
      notification.show(
        <TradingCopilotToast
          toast={toast.details}
          dialogId={toast.dialogId}
          openDialog={openDialog}
        />,
        'bottom-right',
        toast.popupId,
      );
    });
  }, [notification]);

  if (!activeDialogId || activeDialogData === undefined) {
    return null;
  }

  return (
    <TradingCopilotDialog dialog={activeDialogData} closeDialog={closeDialog} />
  );
};
