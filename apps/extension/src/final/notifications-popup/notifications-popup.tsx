import { useState } from 'react';

import { useNotification } from 'shared/ui';
import { onWindowMessage, SWAP_EVENT } from 'shared/messaging';
import { SwapData } from 'application/trading-copilot';

import { TradingCopilotToast, TradingCopilotDialog } from './components';
import { ContentProperties } from './notifications-popup.types';

export const NotificationsPopup = () => {
  const [activeDialog, setActiveDialog] = useState<SwapData | null>(null);

  const openDialog = (dialog: SwapData) => {
    setActiveDialog(dialog);
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  return (
    <NotificationsPopupContent
      openDialog={openDialog}
      closeDialog={closeDialog}
      activeDialog={activeDialog}
    />
  );
};

const NotificationsPopupContent = ({
  openDialog,
  closeDialog,
  activeDialog,
}: ContentProperties) => {
  const notification = useNotification();

  onWindowMessage(SWAP_EVENT, (data: SwapData) => {
    notification.show(
      <TradingCopilotToast toast={data} openDialog={openDialog} />,
      'bottom-right',
      data.transactionHash,
    );
  });

  if (!activeDialog) {
    return null;
  }

  return (
    <TradingCopilotDialog dialog={activeDialog} closeDialog={closeDialog} />
  );
};
