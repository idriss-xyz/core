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
  GetTokensImageCommand,
  GetTokensListCommand,
  SwapData,
  SwapDataToken,
} from 'application/trading-copilot';
import { GetImageCommand } from 'shared/utils';
import { CHAIN } from 'shared/web3';

import { TradingCopilotToast, TradingCopilotDialog } from './components';
import { Properties, ContentProperties } from './notifications-popup.types';
import { isAddress } from 'viem';

const IDRISS_TOKEN_ADDRESS = '0x000096630066820566162c94874a776532705231';

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
  const selectedToken: MutableRefObject<SwapDataToken | null> = useRef<SwapDataToken>(null);
  const selectedTokenImage = useRef<string>('');
  const notification = useNotification();
  const ensNameMutation = useCommandMutation(GetEnsNameCommand);
  const ensInfoMutation = useCommandMutation(GetEnsInfoCommand);
  const imageMutation = useCommandMutation(GetImageCommand);
  const tokenListMutation = useCommandMutation(GetTokensListCommand);
  const tokenIconMutation = useCommandMutation(GetTokensImageCommand);

  useEffect(() => {
    if (!isSwapEventListenerAdded.current) {
      const handleSwapEvent = async (data: SwapData) => {
        const isEVMAddress = isAddress(data.from);
        const ensName = isEVMAddress ? await ensNameMutation.mutateAsync({
          address: data.from,
        }) : null;

        const ensAvatarUrl = isEVMAddress ? await ensInfoMutation.mutateAsync({
          ensName: ensName ?? '',
          infoKey: 'avatar',
        }): null;

        const avatarImage = isEVMAddress ? await imageMutation.mutateAsync({
          src: ensAvatarUrl ?? '',
        }): null;

        const tokensList = await tokenListMutation.mutateAsync();

        const tokenAddress = data.tokenIn.address;

        // Filter token list by chain (Base)
        const tokens = tokensList?.tokens?.[CHAIN.BASE.id] ?? [];
        const tokenData =
        isEVMAddress ?
          tokens.find((t) => {
            return t?.address?.toLowerCase() === tokenAddress.toLowerCase();
          }) ?? {
            address: tokenAddress,
            symbol: '',
            decimals: data.tokenIn.decimals,
            amount: data.tokenIn.amount,
            network: data.tokenIn.network,
          }
          : data.tokenIn;

        selectedToken.current = tokenData;
        const tokenImage =
          tokenData.address.toLowerCase() === IDRISS_TOKEN_ADDRESS
            ? 'IdrissToken'
            : ((await tokenIconMutation.mutateAsync({
                tokeURI: tokenData?.logoURI ?? '',
              })) ?? '');
        selectedTokenImage.current = tokenImage;

        notification.show(
          <TradingCopilotToast
            tokenData={tokenData}
            tokenImage={tokenImage}
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
    tokenIconMutation,
    tokenListMutation,
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
    <TradingCopilotDialog
      tokenData={selectedToken.current}
      tokenImage={selectedTokenImage.current}
      dialog={activeDialog}
      closeDialog={closeDialog}
    />
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
