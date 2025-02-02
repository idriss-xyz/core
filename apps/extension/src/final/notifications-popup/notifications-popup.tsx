import { useRef, useEffect, useState } from 'react';

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
} from 'application/trading-copilot';
import { GetImageCommand } from 'shared/utils';
import { CHAIN } from 'shared/web3';

import { TradingCopilotToast, TradingCopilotDialog } from './components';
import { Properties, ContentProperties } from './notifications-popup.types';

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
  const selectedToken = useRef<Record<string, string>>({});
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

        const tokensList = await tokenListMutation.mutateAsync();

        const tokenAddress = data.tokenIn.address;

        // Filter token list by chain (Base)
        const tokens = tokensList?.tokens?.[CHAIN.BASE.id] ?? [];

        const tokenData =
          tokens.find((t) => {
            return t?.address?.toLowerCase() === tokenAddress.toLowerCase();
          }) ?? {};

        selectedToken.current = tokenData;

        const tokenImage =
          tokenAddress.toLowerCase() === IDRISS_TOKEN_ADDRESS
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
