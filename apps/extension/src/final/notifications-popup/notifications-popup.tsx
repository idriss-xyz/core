import { useState } from 'react';

import { useNotification } from 'shared/ui';
import {
  onWindowMessage,
  SWAP_EVENT,
  useCommandMutation,
} from 'shared/messaging';
import {
  GetEnsInfoCommand,
  GetEnsNameCommand,
  SwapData,
} from 'application/trading-copilot';

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
  const ensNameMutation = useCommandMutation(GetEnsNameCommand);
  const ensInfoMutation = useCommandMutation(GetEnsInfoCommand);

  onWindowMessage(SWAP_EVENT, async (data: SwapData) => {
    const ensName = await ensNameMutation.mutateAsync({
      address: data.from,
    });

    const ensAvatar = await ensInfoMutation.mutateAsync({
      ensName: ensName ?? '',
      infoKey: 'avatar',
    });

    notification.show(
      <TradingCopilotToast
        toast={data}
        openDialog={openDialog}
        ensName={ensName}
        ensAvatar={ensAvatar}
      />,
      'bottom-right',
      data.transactionHash,
    );

    playNotificationSound();
  });

  if (!activeDialog) {
    return null;
  }

  return (
    <TradingCopilotDialog dialog={activeDialog} closeDialog={closeDialog} />
  );
};

const playNotificationSound = () => {
  try {
    const enableSound = localStorage.getItem('idriss-widget-enable-sound');

    if (enableSound === 'false') {
      return;
    }

    let audioFile;

    if (chrome?.runtime?.getURL) {
      audioFile = chrome.runtime.getURL('audio/notification.mp3');
    } else if (browser?.runtime?.getURL) {
      audioFile = browser.runtime.getURL('audio/notification.mp3');
    }

    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.play().catch((error) => {
        console.error('Failed to play notification sound:', error);
      });
    } else {
      console.error('Audio file path is missing or not supported');
    }
  } catch (error) {
    console.error('Error while trying to play notification sound:', error);
  }
};
