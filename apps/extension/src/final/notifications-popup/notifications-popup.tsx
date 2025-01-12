import { type MutableRefObject, useRef, useEffect, useState } from 'react';

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
  const playedTransactionHashes: MutableRefObject<Set<string>> = useRef(
    new Set(),
  );
  const audioInstanceReference: MutableRefObject<HTMLAudioElement | null> =
    useRef(null);
  const lastPlayedTimestampReference: MutableRefObject<number | null> =
    useRef(null);
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

        playNotificationSound(
          data.transactionHash,
          playedTransactionHashes,
          audioInstanceReference,
          lastPlayedTimestampReference,
          data.soundFile,
        );
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

const playNotificationSound = (
  transactionHash: string,
  playedTransactionHashes: MutableRefObject<Set<string>>,
  audioInstanceReference: MutableRefObject<HTMLAudioElement | null>,
  lastPlayedTimestampReference: MutableRefObject<number | null>,
  soundFile?: string,
) => {
  try {
    if (playedTransactionHashes.current.has(transactionHash)) {
      return;
    }

    const enableSound = localStorage.getItem('idriss-widget-enable-sound');

    if (enableSound === 'false' || !soundFile) {
      return;
    }

    const now = Date.now();

    if (
      lastPlayedTimestampReference.current &&
      now - lastPlayedTimestampReference.current < 1000
    ) {
      return;
    }

    if (
      !audioInstanceReference.current ||
      audioInstanceReference.current.ended ||
      audioInstanceReference.current.paused
    ) {
      audioInstanceReference.current = new Audio(soundFile);
      audioInstanceReference.current.addEventListener('ended', () => {
        audioInstanceReference.current = null;
      });
    }

    if (audioInstanceReference.current?.paused) {
      audioInstanceReference.current.play().catch((error) => {
        console.error('Failed to play notification sound:', error);
      });
    }

    playedTransactionHashes.current.add(transactionHash);
    lastPlayedTimestampReference.current = now;
  } catch (error) {
    console.error('Error while trying to play notification sound:', error);
  }
};
