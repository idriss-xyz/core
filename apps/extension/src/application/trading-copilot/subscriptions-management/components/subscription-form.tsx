import { useCallback, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { isAddress } from 'viem';

import { useCommandMutation } from 'shared/messaging';
import { ErrorMessage } from 'shared/ui';
import { isFarcasterName } from 'shared/utils';

import {
  GetEnsAddressCommand,
  GetFarcasterAddressCommand,
} from '../../commands';

import { Properties, FormValues } from './subscription-form.types';

const EMPTY_FORM: FormValues = {
  subscription: '',
};

export const SubscriptionForm = ({
  onSubmit,
  subscriptionsAmount,
}: Properties) => {
  const subscriptionLimit = 10;
  const [showError, setShowError] = useState(false);

  const getEnsAddressMutation = useCommandMutation(GetEnsAddressCommand);
  const getFarcasterAddressMutation = useCommandMutation(
    GetFarcasterAddressCommand,
  );

  const form = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    setTimeout(() => {
      setShowError(false);
    }, 3500);
  }, [showError]);

  const addSubscriber: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      if (Number(subscriptionsAmount) >= subscriptionLimit) {
        setShowError(true);
        form.reset(EMPTY_FORM);

        return;
      }

      if (isAddress(data.subscription)) {
        onSubmit({ address: data.subscription });
        form.reset(EMPTY_FORM);

        return;
      }

      if (isFarcasterName(data.subscription)) {
        const farcasterDetails = await getFarcasterAddressMutation.mutateAsync({
          name: data.subscription,
        });

        if (!farcasterDetails) {
          return;
        }

        onSubmit({
          address: farcasterDetails.address,
          fid: farcasterDetails.fid,
        });
        form.reset(EMPTY_FORM);

        return;
      }

      const ensAddress = await getEnsAddressMutation.mutateAsync({
        ensName: data.subscription,
      });

      if (!ensAddress) {
        return;
      }

      onSubmit({ address: ensAddress });
      form.reset(EMPTY_FORM);
    },
    [
      form,
      onSubmit,
      subscriptionsAmount,
      getEnsAddressMutation,
      getFarcasterAddressMutation,
    ],
  );

  return (
    <form className="pr-4" onSubmit={form.handleSubmit(addSubscriber)}>
      <label
        htmlFor="subscription"
        className="block text-label4 text-neutralGreen-700"
      >
        Subscribe to wallet
      </label>
      <Controller
        name="subscription"
        control={form.control}
        render={({ field }) => {
          return (
            <input
              {...field}
              type="text"
              id="subscription"
              placeholder="e.g., vitalik.eth"
              className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          );
        }}
      />
      {showError && (
        <ErrorMessage className="mt-1">
          Maximum {subscriptionLimit} subscriptions reached. Lock $IDRISS to
          access premium features (coming soon).
        </ErrorMessage>
      )}
    </form>
  );
};
