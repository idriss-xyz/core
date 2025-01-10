import { useEffect, useState } from 'react';

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
import { GetImageCommand } from 'shared/utils';

import { TradingCopilotToast, TradingCopilotDialog } from './components';
import { Properties, ContentProperties } from './notifications-popup.types';

export const NotificationsPopup = ({
  isSwapEventListenerAdded,
}: Properties) => {
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
      isSwapEventListenerAdded={isSwapEventListenerAdded}
    />
  );
};

const NotificationsPopupContent = ({
  openDialog,
  closeDialog,
  activeDialog,
  isSwapEventListenerAdded,
}: ContentProperties) => {
  const notification = useNotification();
  const ensNameMutation = useCommandMutation(GetEnsNameCommand);
  const ensInfoMutation = useCommandMutation(GetEnsInfoCommand);
  const imageMutation = useCommandMutation(GetImageCommand);

  useEffect(() => {
    if (!isSwapEventListenerAdded.current) {
      const handleSwapEvent = async (data: SwapData) => {
        const ensName = await ensNameMutation.mutateAsync({
          address: data.from,
        });

        const ensAvatarUrl = await ensInfoMutation.mutateAsync({
          ensName: ensName ?? '',
          infoKey: 'avatar',
        });

        const avatarImage = await imageMutation.mutateAsync({
          src: ensAvatarUrl ?? '',
        });

        notification.show(
          <TradingCopilotToast
            toast={data}
            openDialog={openDialog}
            ensName={ensName}
            avatarImage={avatarImage}
          />,
          'bottom-right',
          data.transactionHash,
        );

        playNotificationSound(data.soundFile);
      };

      onWindowMessage(SWAP_EVENT, async (data: SwapData) => {
        return handleSwapEvent(data);
      });
      isSwapEventListenerAdded.current = true;
    }
  }, [
    ensInfoMutation,
    ensNameMutation,
    imageMutation,
    isSwapEventListenerAdded,
    notification,
    openDialog,
  ]);

  if (!activeDialog) {
    return null;
  }

  return (
    <TradingCopilotDialog dialog={activeDialog} closeDialog={closeDialog} />
  );
};

const playNotificationSound = (soundFile?: string) => {
  try {
    const enableSound = localStorage.getItem('idriss-widget-enable-sound');

    if (enableSound === 'false' || !soundFile) {
      return;
    }

    const audio = new Audio(soundFile);
    audio.play().catch((error) => {
      console.error('Failed to play notification sound:', error);
    });
  } catch (error) {
    console.error('Error while trying to play notification sound:', error);
  }
};
