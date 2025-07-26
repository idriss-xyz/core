import { useCallback, useMemo } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import {
  applyDecimalsToNumericString,
  formatTokenValue,
  isNativeTokenAddress,
} from '@idriss-xyz/utils';
import { EMPTY_HEX } from '@idriss-xyz/constants';

import { useWallet } from 'shared/extension';
import { IdrissSend } from 'shared/idriss';
import { CHAIN_ID_TO_TOKENS, toAddressWithValidChecksum } from 'shared/web3';
import { ErrorMessage } from 'shared/ui';
import { IDRISS_ICON_CIRCLE } from 'assets/images';

import { useSendForm, useSender } from '../hooks';
import { SendPayload } from '../schema';
import { getLoadingMessage } from '../utils';
import { WidgetData } from '../types';
import { DEFAULT_ALLOWED_CHAINS_IDS } from '../constants';

type Properties = {
  widgetData: WidgetData;
};

export const SendWidget = ({ widgetData }: Properties) => {
  const {
    node,
    username,
    availableNetworks,
    widgetOverrides,
    isHandleUser,
    walletAddress,
  } = widgetData;
  const { wallet } = useWallet();
  const { isConnectionModalOpened, openConnectionModal } = useWallet();

  const allowedChainsIds = availableNetworks ?? DEFAULT_ALLOWED_CHAINS_IDS;

  const sender = useSender({ wallet });

  const { formMethods, chainId, amount, selectedToken, onChangeChainId } =
    useSendForm({
      allowedChainsIds,
      resetErrors: sender.reset,
    });

  const tokens = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId] ?? [];
  }, [chainId]);

  const submit = useCallback(
    async (sendPayload: SendPayload) => {
      await sender.send({
        sendPayload,
        recipientAddress: toAddressWithValidChecksum(
          walletAddress ?? EMPTY_HEX,
        ),
      });
    },
    [sender, walletAddress],
  );

  const amountInSelectedToken = useMemo(() => {
    if (!sender.tokensToSend || !selectedToken?.decimals) {
      return;
    }

    return applyDecimalsToNumericString(
      sender.tokensToSend.toString(),
      selectedToken.decimals,
    );
  }, [selectedToken?.decimals, sender.tokensToSend]);

  const iconSize = isHandleUser ? 17 : 16;

  const reset = useCallback(() => {
    sender.reset();
    formMethods.reset();
  }, [formMethods, sender]);

  return (
    <IdrissSend.Container
      node={node}
      iconSize={iconSize}
      iconSrc={IDRISS_ICON_CIRCLE}
      recipientName={username}
      closeOnClickAway={sender.isIdle}
      onClose={reset}
      header={
        sender.isSending || sender.isSuccess ? undefined : (
          <IdrissSend.Heading>
            {widgetOverrides?.headerCopy ?? `Donate to @${username}`}
          </IdrissSend.Heading>
        )
      }
    >
      {({ close }) => {
        if (sender.isSending) {
          return (
            <IdrissSend.Loading
              className="px-5 pb-9 pt-5"
              heading={
                <>
                  Sending <span className="text-mint-600">${amount}</span>{' '}
                  {amountInSelectedToken
                    ? `(${formatTokenValue(Number(amountInSelectedToken))} ${selectedToken?.symbol})`
                    : null}
                </>
              }
              recipient={username}
            >
              {getLoadingMessage(
                isNativeTokenAddress(selectedToken?.address ?? EMPTY_HEX),
              )}
            </IdrissSend.Loading>
          );
        }

        if (sender.isSuccess) {
          return (
            <IdrissSend.Success
              className="p-5"
              onConfirm={close}
              chainId={chainId}
              transactionHash={sender.data?.transactionHash ?? EMPTY_HEX}
            />
          );
        }

        return (
          <IdrissSend.Form
            formMethods={formMethods}
            onSubmit={submit}
            onChangeChainId={onChangeChainId}
            tokens={tokens}
            allowedChainsIds={allowedChainsIds}
            footer={
              <>
                {wallet ? (
                  <Button
                    intent="primary"
                    size="medium"
                    className="w-full"
                    type="submit"
                  >
                    {widgetOverrides?.sendButtonCopy ?? 'Send'}
                  </Button>
                ) : (
                  <Button
                    intent="primary"
                    size="medium"
                    onClick={openConnectionModal}
                    className="w-full"
                    loading={isConnectionModalOpened}
                  >
                    Log in
                  </Button>
                )}
                {sender.haveEnoughBalance ? (
                  sender.isError && (
                    <ErrorMessage className="mt-4">
                      Something went wrong.
                    </ErrorMessage>
                  )
                ) : (
                  <ErrorMessage className="mt-4">
                    Not enough {selectedToken?.symbol ?? 'tokens'} in your
                    wallet. Add funds to continue.
                  </ErrorMessage>
                )}
              </>
            }
          />
        );
      }}
    </IdrissSend.Container>
  );
};

SendWidget.displayName = 'SendWidget';
