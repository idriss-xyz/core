import { Button } from '@idriss-xyz/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NumericInput } from '@idriss-xyz/ui/numeric-input';
import { useWallet } from '@idriss-xyz/wallet-connect';
import { formatEther, parseEther } from 'viem';
import { useCallback } from 'react';

import { Closable, ErrorMessage, Icon, LazyImage } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';
import {
  FormValues,
  GetEnsBalanceCommand,
  GetEnsInfoCommand,
  GetEnsNameCommand,
  GetQuoteCommand,
  useExchanger,
} from 'application/trading-copilot';
import { getFormattedTimeDifference } from 'shared/utils';
import { CHAIN, roundToSignificantFigures } from 'shared/web3';
import { IdrissSend } from 'shared/idriss';

import {
  Properties,
  ContentProperties,
  WalletBalanceProperties,
  TradeValueProperties,
} from './trading-copilot-dialog.types';

const EMPTY_FORM: FormValues = {
  amount: '',
};

export const TradingCopilotDialog = ({ dialog, closeDialog }: Properties) => {
  const ensNameQuery = useCommandQuery({
    command: new GetEnsNameCommand({
      address: dialog.from,
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (ensNameQuery.isFetching) {
    return;
  }

  return (
    <Closable
      className="fixed left-0 top-0 z-portal size-full bg-black/50"
      hideCloseButton
    >
      <div className="flex size-full items-center justify-center">
        <div className="relative flex w-[400px] flex-col gap-y-5 rounded-lg border border-black/20 bg-white p-5">
          <TradingCopilotDialogContent
            dialog={dialog}
            closeDialog={closeDialog}
            userName={ensNameQuery.data ?? dialog.from}
          />
        </div>
      </div>
    </Closable>
  );
};

const TradingCopilotDialogContent = ({
  dialog,
  userName,
  closeDialog,
}: ContentProperties) => {
  const { wallet, isConnectionModalOpened, openConnectionModal } = useWallet();
  const exchanger = useExchanger({ wallet });

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: userName,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const balanceQuery = useCommandQuery({
    command: new GetEnsBalanceCommand({
      address: wallet?.account ?? '0x',
      blockTag: 'safe',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  const onSubmit = useCallback(
    async (formValues: FormValues) => {
      await exchanger.exchange({
        formValues: formValues,
        dialog: dialog,
      });
    },
    [dialog, exchanger],
  );

  if (exchanger.isSending && exchanger.quoteData?.includedSteps[0]) {
    return (
      <IdrissSend.Loading
        className="px-5 pb-9 pt-5"
        heading={
          <>
            Exchanging{' '}
            <span className="text-mint-600">
              {roundToSignificantFigures(exchanger.details.from.amount, 2)}{' '}
              {exchanger.details.from.symbol}
            </span>
            for
            <span className="text-mint-600">
              {roundToSignificantFigures(exchanger.details.to.amount, 2)}{' '}
              {exchanger.details.to.symbol}
            </span>
          </>
        }
      >
        Confirm transfer in your wallet.
      </IdrissSend.Loading>
    );
  }

  if (exchanger.isSuccess && exchanger.quoteData && exchanger.transactionData) {
    return (
      <IdrissSend.Success
        className="p-5"
        heading="Exchange completed"
        onConfirm={closeDialog}
        chainId={exchanger.quoteData.transactionData.chainId}
        transactionHash={exchanger.transactionData.transactionHash}
      />
    );
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-heading4 text-neutral-900">Copy trade</h1>
        <IconButton
          intent="tertiary"
          size="medium"
          iconName="X"
          onClick={closeDialog}
        />
      </div>
      <div className="grid grid-cols-[48px,1fr] gap-2">
        <LazyImage
          src={avatarQuery.data}
          className="size-12 rounded-full border border-neutral-400 bg-neutral-200"
          fallbackComponent={
            <div className="flex size-12 items-center justify-center rounded-full border border-neutral-300 bg-neutral-200">
              <Icon size={30} name="PersonIcon" className="text-neutral-500" />
            </div>
          }
        />
        <div className="flex w-full flex-col">
          <p className="break-all text-label3 text-neutral-900">
            {userName?.startsWith('0x')
              ? `${userName.slice(0, 6)}...${userName.slice(-4)}`
              : userName}{' '}
            <span className="text-body3 text-neutral-600">
              got {roundToSignificantFigures(dialog.tokenIn.amount, 2)}{' '}
              {dialog.tokenIn.symbol}
            </span>{' '}
            {wallet ? (
              <TradingCopilotTradeValue wallet={wallet} dialog={dialog} />
            ) : null}
          </p>
          <p className="text-body6 text-mint-700">
            {getFormattedTimeDifference(dialog.timestamp)} ago
          </p>
        </div>
      </div>
      <form className="mt-1" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center justify-between">
          <label
            htmlFor="cryptoAmount"
            className="block text-label4 text-neutralGreen-700"
          >
            Amount
          </label>
          {wallet ? <TradingCopilotWalletBalance wallet={wallet} /> : null}
        </div>
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => {
            return (
              <span className="relative mt-2 flex">
                <NumericInput
                  value={value}
                  placeholder="ETH"
                  onChange={onChange}
                  decimalScale={5}
                  className="ps-[60px] text-right"
                />
                <div className="pointer-events-none absolute start-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center after:absolute after:right-0 after:top-1.5 after:h-[calc(100%_-_12px)] after:w-px after:bg-neutral-200">
                  <span className="flex size-6 items-center justify-center rounded-full bg-neutral-200">
                    <IdrissIcon
                      size={18}
                      name="Eth"
                      className="text-neutral-700"
                    />
                  </span>
                </div>
              </span>
            );
          }}
        />
        <div className="mt-5">
          {wallet ? (
            <>
              <Button
                intent="primary"
                size="medium"
                className="w-full"
                type="submit"
                loading={exchanger.isSending}
                disabled={Number(watch('amount')) < Number(balanceQuery.data)}
              >
                BUY {dialog.tokenIn.symbol}
              </Button>
              {exchanger.isError ? (
                <ErrorMessage className="mt-4">
                  Something went wrong.
                </ErrorMessage>
              ) : null}
            </>
          ) : (
            <Button
              intent="primary"
              size="medium"
              onClick={openConnectionModal}
              className="w-full"
              loading={isConnectionModalOpened}
            >
              LOG IN
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

const TradingCopilotWalletBalance = ({ wallet }: WalletBalanceProperties) => {
  const balanceQuery = useCommandQuery({
    command: new GetEnsBalanceCommand({
      address: wallet?.account ?? '',
      blockTag: 'safe',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (!balanceQuery.data) {
    return;
  }

  return (
    <p className="text-body6 text-neutral-500">
      Balance: {roundToSignificantFigures(Number(balanceQuery.data), 2)} ETH
    </p>
  );
};

const TradingCopilotTradeValue = ({ wallet, dialog }: TradeValueProperties) => {
  const amountInEth = dialog.tokenIn.amount.toString();
  const amountInWei = parseEther(amountInEth).toString();

  const quotePayload = {
    amount: amountInWei,
    destinationChain: 8453,
    fromAddress: wallet.account,
    originToken: dialog.tokenIn.address,
    originChain: CHAIN[dialog.tokenIn.network].id,
    destinationToken: '0x0000000000000000000000000000000000000000',
  };

  const quoteQuery = useCommandQuery({
    command: new GetQuoteCommand(quotePayload),
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (!quoteQuery.data) {
    return;
  }

  const tradeValueInWei = BigInt(quoteQuery.data.estimate.toAmount);
  const tradeValueInEth = Number(formatEther(tradeValueInWei));

  return (
    <span className="text-body6 text-neutral-500">
      ({roundToSignificantFigures(tradeValueInEth, 2)} ETH)
    </span>
  );
};
