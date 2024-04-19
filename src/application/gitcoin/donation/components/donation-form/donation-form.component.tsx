import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  ErrorMessage,
  Icon,
  IdrissMoneyInput,
  Spinner,
} from 'shared/ui/components';
import {
  CHAIN,
  ChainSelect,
  dollarToWei,
  roundToSignificantFigures,
  useGetTokenPriceCommandQuery,
  useWallet,
} from 'shared/web3';

import {
  GET_ETH_PRICE_COMMAND_DETAILS,
  GITCOIN_DONATION_CHAINS_IDS,
  MIN_CROSS_CHAIN_DONATION_AMOUNT,
} from '../../donation.constants';
import { DonationOptions } from '../../donation.types';
import { SomethingWentWrongMessage } from '../something-went-wrong-message';
import {
  getDefaultDonationOptions,
  getLoadingMessage,
} from '../../donation.library';
import { useFees } from '../../hooks';
import { useDonationMaker } from '../../hooks/use-donation-maker';
import { createDonationOptionsSchema } from '../../donation.schema';

import { DonationFormProperties } from './donation-form.types';
import { GasIcon } from './gas-icon.component';

export const DonationForm = ({
  application,
  className,
  username,
  onStartDonating,
}: DonationFormProperties) => {
  const { wallet, openConnectionModal, isConnectionModalOpened } = useWallet();
  const [isCrossChain, setIsCrossChain] = useState(false);

  const { control, watch, trigger, handleSubmit } = useForm<DonationOptions>({
    defaultValues: getDefaultDonationOptions(application),
    resolver: zodResolver(createDonationOptionsSchema(isCrossChain)),
  });

  useEffect(() => {
    void trigger();
  }, [trigger, isCrossChain]);

  const [amount, chainId] = watch(['amount', 'chainId']);
  const [debouncedAmount, setDebouncedAmount] = useState(amount);

  useDebounce(
    () => {
      setDebouncedAmount(amount);
    },
    500,
    [amount],
  );

  const getEthPriceQuery = useGetTokenPriceCommandQuery(
    GET_ETH_PRICE_COMMAND_DETAILS,
  );

  const oneDollarPriceInEth = getEthPriceQuery.data?.price
    ? Number(getEthPriceQuery.data.price)
    : 0;

  const userAmountInWei = dollarToWei(debouncedAmount, oneDollarPriceInEth);
  const feesQuery = useFees({
    amountInWei: userAmountInWei,
    application,
    enabled: debouncedAmount >= MIN_CROSS_CHAIN_DONATION_AMOUNT,
  });

  const getChainFeeInDollars = useCallback(
    (chainId: number) => {
      if (!feesQuery.data || !getEthPriceQuery.data) {
        return 0;
      }

      const feeInWei = feesQuery.data[chainId]?.totalRelayFee.total
        ? Number(feesQuery.data[chainId]?.totalRelayFee.total)
        : 0;
      const feeInEth = feeInWei / 10 ** 18;
      const feeInDollars = Number(
        (feeInEth / Number(getEthPriceQuery.data.price)).toFixed(2),
      );

      return feeInDollars;
    },
    [feesQuery.data, getEthPriceQuery.data],
  );

  const donationMaker = useDonationMaker({ wallet });

  const donate: SubmitHandler<DonationOptions> = useCallback(
    (data) => {
      onStartDonating?.();
      void donationMaker.donate({
        application,
        options: data,
        oneDollarPriceInEth,
      });
    },
    [application, donationMaker, onStartDonating, oneDollarPriceInEth],
  );

  const formReference = useRef<HTMLFormElement | null>(null);

  const allowedChainsIds = useMemo(() => {
    return GITCOIN_DONATION_CHAINS_IDS.sort((id) => {
      return id === application.chainId ? -1 : 0;
    });
  }, [application.chainId]);

  if (donationMaker.isDonating) {
    return (
      <div className="flex flex-col items-center text-center">
        <Spinner className="size-24 text-idriss-primary-500" />
        <p className="mt-8 text-lg font-medium leading-6 text-gray-900">
          Waiting for Confirmation
        </p>
        <p className="mt-1 leading-6 text-gray-900">
          Sending{' '}
          <span className="font-bold text-idriss-primary-500">${amount}</span> (
          {roundToSignificantFigures(userAmountInWei / 10 ** 18, 2)} ETH)
        </p>
        <p className="flex items-center space-x-1">
          <span>to </span>
          <span
            className="block max-w-40 truncate whitespace-nowrap"
            title={username}
          >
            @{username}
          </span>{' '}
          <Icon
            size={16}
            name="TwitterLogoIcon"
            className="text-twitter-primary [&>path]:fill-rule-non-zero"
          />
        </p>
        <p className="mt-1 text-xs font-medium leading-6 text-gray-500">
          {getLoadingMessage(isCrossChain)}
        </p>
      </div>
    );
  }

  if (donationMaker.isSuccess) {
    return (
      <div className="flex flex-col items-center text-center">
        <Icon
          name="CheckCircledIcon"
          className="text-idriss-primary-500"
          size={124}
        />
        <p className="mt-4 text-lg font-medium leading-6 text-gray-900">
          Transaction Submitted🥳
        </p>
        <a
          href={`${
            Object.values(CHAIN).find((chain) => {
              return chain.id === chainId;
            })?.blockExplorerUrls[0] ?? '#'
          }/tx/${donationMaker.data?.transactionHash ?? ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center space-x-1"
        >
          <span className="text-base font-normal leading-6 text-gray-500">
            View on Explorer
          </span>
          <Icon name="ExternalLinkIcon" size={16} className="text-gray-500" />
        </a>
      </div>
    );
  }

  return (
    <>
      <p className="truncate text-lg font-medium leading-6">
        Donate to @{username}
      </p>

      <form
        ref={formReference}
        className={className}
        onSubmit={handleSubmit(donate)}
      >
        <Controller
          control={control}
          name="amount"
          render={({ field, fieldState }) => {
            return (
              <IdrissMoneyInput
                value={field.value}
                onChange={field.onChange}
                className="mt-4"
                errorMessage={fieldState.error?.message}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="chainId"
          render={({ field }) => {
            return (
              <ChainSelect
                className="mt-5"
                label="Network"
                allowedChainsIds={allowedChainsIds}
                renderSuffix={(chainId) => {
                  if (chainId === application.chainId) {
                    return null;
                  }
                  if (getEthPriceQuery.isLoading || feesQuery.isLoading) {
                    return (
                      <div className="flex w-full items-center justify-end">
                        <Spinner className="size-2" />
                      </div>
                    );
                  }
                  const feeInDollars = getChainFeeInDollars(chainId);
                  return (
                    <>
                      {feeInDollars > 0 ? (
                        <p className="flex w-full items-center justify-end space-x-1 text-xs text-gray-500">
                          <span>{`$${feeInDollars}`}</span>
                          <span>+</span>
                          <GasIcon />
                        </p>
                      ) : null}
                    </>
                  );
                }}
                onChange={(value) => {
                  setIsCrossChain(value !== application.chainId);
                  field.onChange(value);
                }}
                value={field.value}
              />
            );
          }}
        />
        {wallet ? (
          <Button
            loading={getEthPriceQuery.isLoading || feesQuery.isLoading}
            disabled={getEthPriceQuery.isError || feesQuery.isError}
            className="mt-6 w-full rounded-md bg-idriss-primary-500 py-2 text-base font-medium text-white shadow-sm hover:bg-idriss-primary-400"
            type="submit"
          >
            Donate
          </Button>
        ) : (
          <Button
            className="mt-6 w-full rounded-md bg-idriss-primary-500 py-2 text-base font-medium text-white shadow-sm hover:bg-idriss-primary-400"
            loading={isConnectionModalOpened}
            onClick={openConnectionModal}
          >
            Connect wallet
          </Button>
        )}
        {getEthPriceQuery.isError || feesQuery.isError ? (
          <SomethingWentWrongMessage
            onRetry={async () => {
              await getEthPriceQuery.refetch();
              await feesQuery.refetch();
            }}
          />
        ) : null}
        {donationMaker.isError ? (
          <ErrorMessage className="mt-4">Something went wrong.</ErrorMessage>
        ) : null}
      </form>
    </>
  );
};
