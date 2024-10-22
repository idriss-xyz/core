import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useCommandMutation } from 'shared/messaging';

import { Subscription } from '../../types';
import { GetEnsAddressCommand } from '../../commands';

type SubscriptionFormValues = {
  ensName: string;
};

type Properties = {
  onSubmit: (subscription: Subscription) => void;
};

const EMPTY_FORM: SubscriptionFormValues = {
  ensName: '',
};

export const SubscriptionForm = ({ onSubmit }: Properties) => {
  const form = useForm<SubscriptionFormValues>({
    defaultValues: EMPTY_FORM,
  });

  const getEnsAddressMutation = useCommandMutation(GetEnsAddressCommand);

  const addSubscriber: SubmitHandler<SubscriptionFormValues> = useCallback(
    async (data) => {
      const address = await getEnsAddressMutation.mutateAsync({
        ensName: data.ensName,
      });
      if (!address) {
        return;
      }
      onSubmit({
        ensName: data.ensName,
        walletAddress: address,
      });
      form.reset(EMPTY_FORM);
    },
    [form, getEnsAddressMutation, onSubmit],
  );

  return (
    <form onSubmit={form.handleSubmit(addSubscriber)}>
      <label
        htmlFor="subscriptionName"
        className="block text-sm font-semibold leading-6 text-gray-900"
      >
        Subscribe to Wallet
      </label>
      <Controller
        control={form.control}
        name="ensName"
        render={({ field }) => {
          return (
            <input
              {...field}
              type="text"
              id="subscriptionName"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., vitalik.eth"
            />
          );
        }}
      />
    </form>
  );
};
