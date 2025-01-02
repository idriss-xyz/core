import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { useCommandMutation } from 'shared/messaging';
import { ErrorMessage } from 'shared/ui';
import { LsFarcasterUserImages } from 'application/trading-copilot/types';

import {
  GetEnsAddressCommand,
  GetFarcasterAddressCommand,
  GetFarcasterUserCommand,
} from '../../commands';

import { Properties, FormValues } from './subscription-form.types';

const EMPTY_FORM: FormValues = {
  subscriptionDetails: '',
};

export const SubscriptionForm = ({
  onSubmit,
  subscriptionsAmount,
}: Properties) => {
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
  const getFarcasterUserMutation = useCommandMutation(GetFarcasterUserCommand);

  const addSubscriber: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      const hexPattern = /^0x[\dA-Fa-f]+$/;
      const farcasterPattern = /^[^.]+$/;
      const isWalletAddress = hexPattern.test(data.subscriptionDetails);
      const isFarcasterName = farcasterPattern.test(data.subscriptionDetails);

      if (isWalletAddress) {
        onSubmit(data.subscriptionDetails);
        form.reset(EMPTY_FORM);
      }

      if (isFarcasterName) {
        const farcasterDetails = await getFarcasterAddressMutation.mutateAsync({
          name: data.subscriptionDetails,
        });

        if (!farcasterDetails) {
          return;
        }

        const farcasterUser = await getFarcasterUserMutation.mutateAsync({
          id: farcasterDetails.fid,
        });

        if (farcasterUser) {
          const lsFarcasterPfps = localStorage.getItem('farcasterPfps');
          // @ts-expect-error TODO: temporary, remove when API will be ready
          const parsedLsFarcasterPfps: LsFarcasterUserImages = JSON.parse(
            lsFarcasterPfps ?? '[]',
          );

          localStorage.setItem(
            'farcasterPfps',
            JSON.stringify([
              ...parsedLsFarcasterPfps,
              {
                wallet: farcasterDetails.address,
                pfp: farcasterUser.result.user.pfp.url,
              },
            ]),
          );
        }

        onSubmit(farcasterDetails.address);
        form.reset(EMPTY_FORM);
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
      getFarcasterUserMutation,
      onSubmit,
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
