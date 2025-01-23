import { useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { isAddress as isSolanaAddress } from "@solana/web3.js";

import { useWallet } from 'shared/extension';
import { useCommandMutation } from 'shared/messaging';
import { ErrorMessage } from 'shared/ui';

import {
  GetEnsAddressCommand,
  GetFarcasterAddressCommand,
} from '../../commands';

import { Properties, FormValues } from './subscription-form.types';

const EMPTY_FORM: FormValues = {
  subscriptionDetails: '',
};

export const SubscriptionForm = ({
  onSubmit,
  subscriptionsAmount,
}: Properties) => {
  const { wallet } = useWallet();

  const [showError, setShowError] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  const subscriptionLimit = 10;

  const getEnsAddressMutation = useCommandMutation(GetEnsAddressCommand);
  const getFarcasterAddressMutation = useCommandMutation(
    GetFarcasterAddressCommand,
  );

  useEffect(() => {
    setTimeout(() => {
      setShowError(false);
    }, 3500);
  }, [showError]);

  const addSubscriber: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      if (Number(subscriptionsAmount) >= subscriptionLimit) {
        form.reset(EMPTY_FORM);
        setShowError(true);
        return;
      }
      const hexPattern = /^0x[\dA-Fa-f]+$/;
      const farcasterPattern = /^[^.]+$/;
      const isHex = hexPattern.test(data.subscriptionDetails);
      const isFarcasterName = farcasterPattern.test(data.subscriptionDetails);

      if (!wallet) {
        return;
      }
      let chainType: 'EVM' | 'SOLANA' = 'EVM'

      if (isHex) {
        if (!isAddress(data.subscriptionDetails)){
            // TODO: Move validation to input error message
            console.error('Not an address');
            return;
        }
        onSubmit(data.subscriptionDetails, undefined, chainType);
        form.reset(EMPTY_FORM);
        return;
      }
      if (isSolanaAddress(data.subscriptionDetails)){
        chainType = 'SOLANA'
        onSubmit(data.subscriptionDetails, undefined, chainType);
        form.reset(EMPTY_FORM);
        return;
      }

      if (isFarcasterName) {
        const farcasterDetails = await getFarcasterAddressMutation.mutateAsync({
          name: data.subscriptionDetails,
        });

        if (!farcasterDetails) {
          return;
        }

        onSubmit(farcasterDetails.address, farcasterDetails.fid);
        form.reset(EMPTY_FORM);
        return;
      }

      const address = await getEnsAddressMutation.mutateAsync({
        ensName: data.subscriptionDetails,
      });


      if (!address) {
        return;
      }

      onSubmit(address);
      form.reset(EMPTY_FORM);
    },
    [
      form,
      getEnsAddressMutation,
      getFarcasterAddressMutation,
      onSubmit,
      wallet,
      subscriptionsAmount,
    ],
  );

  return (
    <form className="pr-4" onSubmit={form.handleSubmit(addSubscriber)}>
      <label
        htmlFor="subscriptionDetails"
        className="block text-label4 text-neutralGreen-700"
      >
        Subscribe to wallet
      </label>
      <Controller
        control={form.control}
        name="subscriptionDetails"
        render={({ field }) => {
          return (
            <input
              {...field}
              type="text"
              id="subscriptionDetails"
              className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., vitalik.eth"
            />
          );
        }}
      />
      {showError && (
        <ErrorMessage className="mt-1">
          Maximum 10 subscriptions reached. Lock $IDRISS to access premium
          features (coming soon).
        </ErrorMessage>
      )}
    </form>
  );
};
