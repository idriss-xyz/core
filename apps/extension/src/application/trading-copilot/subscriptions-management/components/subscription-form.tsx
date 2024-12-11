import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useCommandMutation } from 'shared/messaging';

import { SubscriptionRequest } from '../../types';
import { GetEnsAddressCommand } from '../../commands';

type SubscriptionFormValues = {
  ensName: string;
};

type Properties = {
  onSubmit: (address: SubscriptionRequest['address']) => void;
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
      onSubmit(address);
      form.reset(EMPTY_FORM);
    },
    [form, getEnsAddressMutation, onSubmit],
  );

  return (
    <form onSubmit={form.handleSubmit(addSubscriber)}>
      <label
        htmlFor="subscriptionName"
        className="block text-label4 text-neutralGreen-700"
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
              className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., vitalik.eth"
            />
          );
        }}
      />
    </form>
  );
};
