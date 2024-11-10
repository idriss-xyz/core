import { useCallback, useMemo } from 'react';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { IdrissSend } from 'shared/idriss';
import {
  CHAIN_ID_TO_TOKENS,
  EMPTY_HEX,
  applyDecimalsToNumericString,
  isNativeTokenAddress,
  roundToSignificantFigures,
  toAddressWithValidChecksum,
} from 'shared/web3';
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

  const allowedChainsIds = availableNetworks ?? DEFAULT_ALLOWED_CHAINS_IDS;

  const sender = useSender({ wallet });

  const { formMethods, chainId, amount, selectedToken, onChangeChainId } =
    useSendForm({
      allowedChainsIds,
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

  const iconSize = isHandleUser ? 16 : 14;

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
        <IdrissSend.Heading>
          {widgetOverrides?.headerCopy ?? `Send to @${username}`}
        </IdrissSend.Heading>
      }
    >
      {({ close }) => {
        if (sender.isSending) {
          return (
            <IdrissSend.Loading
              heading={
                <>
                  Sending{' '}
                  <span className="font-bold text-[#11DD74]">${amount}</span>{' '}
                  {amountInSelectedToken
                    ? `(${roundToSignificantFigures(Number(amountInSelectedToken), 2)} ${selectedToken?.symbol})`
                    : null}
                </>
              }
              recipient={username}
            >
              {getLoadingMessage(
                isNativeTokenAddress(selectedToken?.address ?? '0x'),
              )}
            </IdrissSend.Loading>
          );
        }

        if (sender.isSuccess) {
          return (
            <IdrissSend.Success
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
                  <IdrissSend.SubmitButton>
                    {widgetOverrides?.sendButtonCopy ?? 'Send'}
                  </IdrissSend.SubmitButton>
                ) : (
                  <IdrissSend.ConnectWalletButton />
                )}
                {sender.isError ? (
                  <ErrorMessage className="mt-4">
                    Something went wrong.
                  </ErrorMessage>
                ) : null}
              </>
            }
          />
        );
      }}
    </IdrissSend.Container>
  );
};

SendWidget.displayName = 'SendWidget';
