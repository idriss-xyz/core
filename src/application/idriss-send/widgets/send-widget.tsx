import { ReactNode, memo, useCallback, useMemo, useState } from 'react';

import { IdrissSend } from 'shared/idriss';
import {
  CHAIN_ID_TO_TOKENS,
  Hex,
  applyDecimalsToNumericString,
  isNativeTokenAddress,
  roundToSignificantFigures,
  useWallet,
} from 'shared/web3';
import { ErrorMessage } from 'shared/ui';

import { useSendForm, useSender } from '../hooks';
import { SendPayload } from '../schema';
import { getLoadingMessage } from '../utils';

interface Properties {
  node: HTMLElement;
  recipientAddress: Hex;
  username: string;
  iconSize: number;
  iconSrc: string;
  headerCopy?: ReactNode;
  sendButtonCopy?: ReactNode;
  availableNetworks: number[];
}

const _SendWidget = ({
  username,
  iconSize,
  iconSrc,
  node,
  recipientAddress,
  availableNetworks,
  headerCopy,
  sendButtonCopy,
  onClose,
}: Properties & { onClose: () => void }) => {
  const { wallet } = useWallet();

  const sender = useSender({ wallet });

  const { formMethods, chainId, amount, selectedToken, onChangeChainId } =
    useSendForm({
      allowedChainsIds: availableNetworks,
    });

  const tokens = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId] ?? [];
  }, [chainId]);

  const submit = useCallback(
    async (sendPayload: SendPayload) => {
      await sender.send({
        sendPayload,
        recipientAddress,
      });
    },
    [recipientAddress, sender],
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

  return (
    <IdrissSend.Container
      widgetDataAttribute="idriss-send-widget"
      node={node}
      iconSize={iconSize}
      iconSrc={iconSrc}
      recipientName={username}
      onClose={onClose}
      closeOnClickAway={sender.isIdle}
    >
      {({ close }) => {
        if (sender.isSending) {
          return (
            <IdrissSend.Loading
              heading={
                <>
                  Sending{' '}
                  <span className="font-bold text-idriss-primary-500">
                    ${amount}
                  </span>{' '}
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
              transactionHash={sender.data?.transactionHash ?? ''}
            />
          );
        }

        return (
          <>
            <IdrissSend.Heading>
              {headerCopy ?? `Send to @${username}`}
            </IdrissSend.Heading>
            <IdrissSend.Form
              formMethods={formMethods}
              onSubmit={submit}
              onChangeChainId={onChangeChainId}
              tokens={tokens}
              className="mt-4"
              allowedChainsIds={availableNetworks}
              footer={
                <>
                  {wallet ? (
                    <IdrissSend.SubmitButton>
                      {sendButtonCopy ?? 'Send'}
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
          </>
        );
      }}
    </IdrissSend.Container>
  );
};

export const SendWidget = memo((properties: Properties) => {
  const [closeCount, setCloseCount] = useState(0);

  const onClose = useCallback(() => {
    setCloseCount((previous) => {
      return previous + 1;
    });
  }, []);

  return <_SendWidget {...properties} key={closeCount} onClose={onClose} />;
});

SendWidget.displayName = 'SendWidget';
