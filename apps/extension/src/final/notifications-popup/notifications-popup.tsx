import { useRef, useEffect, useState, MutableRefObject } from 'react';
import { isAddress } from 'viem';

import { useNotification } from 'shared/ui';
import {
  onWindowMessage,
  SWAP_EVENT,
  useCommandMutation,
} from 'shared/messaging';
import {
  GetEnsInfoCommand,
  GetEnsNameCommand,
  GetFarcasterUserCommand,
  GetTokensImageCommand,
  GetTokensListCommand,
  SwapData,
  SwapDataToken,
} from 'application/trading-copilot';
import { GetImageCommand } from 'shared/utils';
import { CHAIN } from 'shared/web3';

import { TradingCopilotToast, TradingCopilotDialog } from './components';
import { Properties, ContentProperties } from './notifications-popup.types';
import { SubscriptionsStorage } from 'shared/web3/storage';

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
  const selectedToken: MutableRefObject<SwapDataToken | null> =
    useRef<SwapDataToken>(null);
  const selectedTokenImage = useRef<string>('');
  const notification = useNotification();
  const ensNameMutation = useCommandMutation(GetEnsNameCommand);
  const ensInfoMutation = useCommandMutation(GetEnsInfoCommand);
  const imageMutation = useCommandMutation(GetImageCommand);
  const farcasterUserMutation = useCommandMutation(
    GetFarcasterUserCommand,
  );
  const tokenListMutation = useCommandMutation(GetTokensListCommand);
  const tokenIconMutation = useCommandMutation(GetTokensImageCommand);


  useEffect(() => {

    if (!isSwapEventListenerAdded.current) {
      const handleSwapEvent = async (data: SwapData) => {
        let ensName: string | null = null;
        let avatarImage: string | null = null;
        const subscriptions = await SubscriptionsStorage.get();
        const matchingSubscription = subscriptions?.find(
          (sub) => sub.address === data.from,
        );
        const isEVMAddress = isAddress(data.from);

        const getFarcasterDetails = async () => {
          if (!matchingSubscription?.fid) return null;
          const response = await farcasterUserMutation.mutateAsync({
            id: matchingSubscription.fid,
          });
          if (!response) return null;
          return {
            name: response.user.displayName,
            avatar: response.user.pfp.url,
          };
        };

        const getEnsDetails = async () => {
          const ensNameResponse = await ensNameMutation.mutateAsync({
            address: data.from,
          });
          if (!ensNameResponse) return null;
          const ensAvatarUrl = await ensInfoMutation.mutateAsync({
            ensName: ensNameResponse,
            infoKey: 'avatar',
          });
          return {
            name: ensNameResponse,
            avatar: ensAvatarUrl,
          };
        };

        const userDetails = isEVMAddress
          ? (await getEnsDetails()) ?? (await getFarcasterDetails())
          : await getFarcasterDetails();

        if (userDetails) {
          ensName = userDetails.name;
          avatarImage = await imageMutation.mutateAsync({
            src: userDetails.avatar ?? '',
          });
        }

        const tokensList = await tokenListMutation.mutateAsync();
        const tokenAddress = data.tokenIn.address;
        const tokens = tokensList?.tokens?.[CHAIN.BASE.id] ?? [];

        const tokenData = isEVMAddress
          ? (tokens.find((t) => {
              return t?.address?.toLowerCase() === tokenAddress.toLowerCase();
            }) ?? {
              address: tokenAddress,
              symbol: '',
              decimals: data.tokenIn.decimals,
              amount: data.tokenIn.amount,
              network: data.tokenIn.network,
            })
          : data.tokenIn;

        selectedToken.current = tokenData;
        const tokenImage =
          tokenData.address.toLowerCase() === IDRISS_TOKEN_ADDRESS
            ? 'IdrissToken'
            : await (async () => {
                try {
                  return (
                    (await tokenIconMutation.mutateAsync({
                      tokenURI: tokenData?.logoURI ?? '',
                    })) ?? ''
                  );
                } catch {
                  return '';
                }
              })();
        selectedTokenImage.current = '';

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
