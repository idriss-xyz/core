import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useWallet } from '@idriss-xyz/wallet-connect';

import { useCommandMutation } from 'shared/messaging';
import { ErrorMessage } from 'shared/ui';

import { useLoginViaSiwe } from '../../hooks';
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
  const siwe = useLoginViaSiwe();

  const form = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });
  const subscriptionLimit = 10;
  const isSubscriptionLimitExceeded =
    subscriptionsAmount !== undefined &&
    subscriptionsAmount >= subscriptionLimit;

  const getEnsAddressMutation = useCommandMutation(GetEnsAddressCommand);
  const getFarcasterAddressMutation = useCommandMutation(
    GetFarcasterAddressCommand,
  );

  const addSubscriber: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      const hexPattern = /^0x[\dA-Fa-f]+$/;
      const farcasterPattern = /^[^.]+$/;
      const isWalletAddress = hexPattern.test(data.subscriptionDetails);
      const isFarcasterName = farcasterPattern.test(data.subscriptionDetails);
      const siweLoggedIn = siwe.loggedIn();

      if (!wallet) {
        return;
      }

      if (!siweLoggedIn) {
        await siwe.login(wallet);
      }

      if (isWalletAddress) {
        onSubmit(data.subscriptionDetails);
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
      siwe,
      wallet,
    ],
  );

  return (
    <form onSubmit={form.handleSubmit(addSubscriber)}>
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
              disabled={isSubscriptionLimitExceeded}
            />
          );
        }}
      />
      {isSubscriptionLimitExceeded && (
        <ErrorMessage className="mt-1">
          Subscriptions limit exceeded ({subscriptionLimit}).
        </ErrorMessage>
      )}
    </form>
  );
};
