import { Button } from '@idriss-xyz/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { Icon as IdrissIcon } from '@idriss-xyz/ui/icon';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NumericInput } from '@idriss-xyz/ui/numeric-input';
import { formatEther, isAddress, parseEther } from 'viem';
import { useCallback } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import {
  formatBigNumber,
  getShortWalletHex,
  getTimeDifferenceString,
  roundToSignificantFiguresForCopilotTrading,
} from '@idriss-xyz/utils';
import { EMPTY_HEX } from '@idriss-xyz/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@idriss-xyz/ui/tooltip';

import { useWallet } from 'shared/extension';
import { Closable, ErrorMessage, Icon, LazyImage } from 'shared/ui';
import { useCommandQuery } from 'shared/messaging';
import {
  FormValues,
  GetEnsBalanceCommand,
  GetEnsInfoCommand,
  GetEnsNameCommand,
  GetQuoteCommand,
  useExchanger,
  useLoginViaSiwe,
} from 'application/trading-copilot';
import { CHAIN, getWholeNumber } from 'shared/web3';
import { IdrissSend } from 'shared/idriss';

import { TokenIcon } from '../../utils';
import { TradingCopilotTooltip } from '../trading-copilot-tooltip';

import {
  Properties,
  ContentProperties,
  WalletBalanceProperties,
  TradeValueProperties,
} from './trading-copilot-dialog.types';

const EMPTY_FORM: FormValues = {
  amount: '',
};

export const TradingCopilotDialog = ({
  dialog,
  closeDialog,
  tokenData,
  tokenImage,
}: Properties) => {
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
        <div className="relative flex min-h-[300px] w-[400px] flex-col justify-center gap-y-3 rounded-lg border border-black/20 bg-white p-5">
          <TradingCopilotDialogContent
            tokenData={tokenData}
            tokenImage={tokenImage}
            dialog={dialog}
            closeDialog={closeDialog}
            userName={ensNameQuery.data ?? dialog.from}
          />
          <div className="self-stretch text-center opacity-70">
            <span
              className={classes(
                'text-body6 text-neutralGreen-900',
                'md:text-body6',
              )}
            >
              Only trade on sites you trust.{' '}
            </span>
            <Link
              size="medium"
              href="https://support.metamask.io/more-web3/dapps/user-guide-dapps/"
              isExternal
              className={classes(
                'border-none text-body6',
                'md:text-body6',
                //lg here is intentional to override the Link variant style
                'lg:text-body6',
              )}
            >
              Learn{'\u00A0'}more
            </Link>
          </div>
        </div>
      </div>
    </Closable>
  );
};

const TradingCopilotDialogContent = ({
  dialog,
  userName,
  closeDialog,
  tokenData,
  tokenImage,
}: ContentProperties) => {
  const { wallet, isConnectionModalOpened, openConnectionModal } = useWallet();
  const exchanger = useExchanger({ wallet });
  const siwe = useLoginViaSiwe();

  const avatarQuery = useCommandQuery({
    command: new GetEnsInfoCommand({
      ensName: userName,
      infoKey: 'avatar',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const balanceQuery = useCommandQuery({
    command: new GetEnsBalanceCommand({
      address: wallet?.account ?? EMPTY_HEX,
      blockTag: 'safe',
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const { handleSubmit, control, watch } = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  const onSubmit = useCallback(
    async (formValues: FormValues) => {
      if (!wallet) {
        return;
      }

      await exchanger.exchange({
        formValues: formValues,
        dialog: dialog,
      });
    },
    [dialog, exchanger, wallet],
  );

  if (exchanger.isSending && exchanger.quoteData?.includedSteps[0]) {
    const { value: fromRoundedNumber, index: fromZerosIndex } =
      roundToSignificantFiguresForCopilotTrading(
        exchanger.details.from.amount,
        2,
      );

    const { value: toRoundedNumber, index: toZerosIndex } =
      roundToSignificantFiguresForCopilotTrading(
        exchanger.details.to.amount,
        2,
      );
    return (
      <IdrissSend.Loading
        className="px-5 pb-9 pt-5"
        heading={
          <>
            Swapping{' '}
            <span className="text-mint-600">
              <TradingCopilotTooltip
                content={getWholeNumber(
                  exchanger.details.from.amount.toString(),
                )}
              >
                {fromZerosIndex ? (
                  <>
                    0.0
                    <span className="inline-block translate-y-1 px-px text-xs">
                      {fromZerosIndex}
                    </span>
                    {fromRoundedNumber}
                  </>
                ) : (
                  fromRoundedNumber
                )}
              </TradingCopilotTooltip>{' '}
              {exchanger.details.from.symbol}
            </span>
            for
            <span className="text-mint-600">
              <TradingCopilotTooltip
                content={getWholeNumber(exchanger.details.to.amount.toString())}
              >
                {toZerosIndex ? (
                  <>
                    0.0
                    <span className="inline-block translate-y-1 px-px text-xs">
                      {toZerosIndex}
                    </span>
                    {toRoundedNumber}
                  </>
                ) : (
                  toRoundedNumber
                )}
              </TradingCopilotTooltip>{' '}
              {exchanger.details.to.symbol}
            </span>
          </>
        }
      >
        Confirm swap in your wallet.
      </IdrissSend.Loading>
    );
  }

  if (exchanger.isSuccess && exchanger.quoteData && exchanger.transactionData) {
    return (
      <IdrissSend.Success
        className="p-5"
        heading="Swap completed"
        onConfirm={closeDialog}
        chainId={exchanger.quoteData.transactionData.chainId}
        transactionHash={exchanger.transactionData.transactionHash}
      />
    );
  }

  const { value: roundedNumber, index: zerosIndex } =
    roundToSignificantFiguresForCopilotTrading(dialog.tokenIn.amount, 2);

  return (
    <>
      <div className="flex h-[28px] flex-row items-center justify-between">
        <h1 className="text-heading4 text-neutral-900">Copy trade</h1>
        <IconButton
          intent="tertiary"
          size="medium"
          iconName="X"
          className="pr-0 pt-1.5 text-neutral-600"
          onClick={closeDialog}
        />
      </div>
      <div className="grid grid-cols-[48px,1fr] gap-2 py-2">
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
            {isAddress(userName) ? (
              <TradingCopilotTooltip content={userName}>
                {getShortWalletHex(userName)}
              </TradingCopilotTooltip>
            ) : (
              userName
            )}{' '}
            <span className="inline-flex items-center gap-x-1 text-body3 text-neutral-600">
              got{' '}
              <TradingCopilotTooltip
                content={
                  <>
                    {formatBigNumber(
                      getWholeNumber(dialog.tokenIn.amount.toString()),
                    )}{' '}
                    ~{' '}
                    {wallet ? (
                      <TradingCopilotTradeValue
                        wallet={wallet}
                        dialog={dialog}
                      />
                    ) : null}
                  </>
                }
              >
                <span>
                  {zerosIndex ? (
                    <>
                      0.0
                      <span className="inline-block translate-y-1 px-px text-xs">
                        {zerosIndex}
                      </span>
                      {roundedNumber}
                    </>
                  ) : (
                    roundedNumber
                  )}
                </span>
              </TradingCopilotTooltip>{' '}
              <span className="flex items-center justify-center gap-x-1">
                {dialog.tokenIn.symbol}
                <TokenIcon tokenImage={tokenImage} tokenData={tokenData} />
              </span>
            </span>
          </p>
          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="w-fit text-body6 text-mint-700">
                  {getTimeDifferenceString({
                    text: 'ago',
                    variant: 'short',
                    timestamp: dialog.timestamp,
                  })}
                </p>
              </TooltipTrigger>

              <TooltipContent className="z-portal w-fit bg-black text-white">
                <p className="text-body6">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                    .format(new Date(dialog.timestamp))
                    .replaceAll('/', '-')}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
                  className="w-[358px] ps-[60px] text-right"
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
                className="mt-2 w-full"
                type="submit"
                loading={siwe.isSending || exchanger.isSending}
                disabled={
                  Number(watch('amount')) > Number(balanceQuery.data) ||
                  Number(watch('amount')) <= 0
                }
              >
                BUY {dialog.tokenIn.symbol}
              </Button>
              {siwe.isError || exchanger.isError ? (
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

  const { value: roundedNumber, index: zerosIndex } =
    roundToSignificantFiguresForCopilotTrading(Number(balanceQuery.data), 2);

  return (
    <p className="text-body6 text-neutral-500">
      Balance:{' '}
      <TradingCopilotTooltip content={getWholeNumber(balanceQuery.data)}>
        {zerosIndex ? (
          <>
            0.0
            <span className="inline-block translate-y-1 px-px text-xs">
              {zerosIndex}
            </span>
            {roundedNumber}
          </>
        ) : (
          roundedNumber
        )}
      </TradingCopilotTooltip>{' '}
      ETH
    </p>
  );
};

const TradingCopilotTradeValue = ({ wallet, dialog }: TradeValueProperties) => {
  const amountInEth = dialog.tokenIn.amount.toString();
  const amountInWei = parseEther(amountInEth).toString();

  const quotePayload = {
    amount: amountInWei,
    destinationChain: CHAIN[dialog.tokenOut.network].id,
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
    return null;
  }

  const tradeValueInWei = BigInt(quoteQuery.data.estimate.toAmount);
  const tradeValueInEth = Number(formatEther(tradeValueInWei));

  return <span>{getWholeNumber(tradeValueInEth.toString())} ETH</span>;
};
