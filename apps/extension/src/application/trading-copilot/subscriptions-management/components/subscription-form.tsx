import { useCallback, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { isAddress } from 'viem';
import { Link } from '@idriss-xyz/ui/link';
import { VAULT_LINK } from '@idriss-xyz/constants';
import { isSolanaAddress } from '@idriss-xyz/utils';

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

const MAX_SUBS_MESSAGE = 'Maximum subscriptions reached.';

export const SubscriptionForm = ({ onSubmit, canSubscribe }: Properties) => {
  const [error, setError] = useState('');

  const getEnsAddressMutation = useCommandMutation(GetEnsAddressCommand);
  const getFarcasterAddressMutation = useCommandMutation(
    GetFarcasterAddressCommand,
  );

  const form = useForm<FormValues>({
    defaultValues: EMPTY_FORM,
  });

  const addSubscriber: SubmitHandler<FormValues> = useCallback(
    async (data) => {
      if (!canSubscribe) {
        setError(MAX_SUBS_MESSAGE);

        form.reset(EMPTY_FORM);

        setTimeout(() => {
          setError('');
        }, 5000);

        return;
      }
      try {
        if (
          isAddress(data.subscription) ||
          isSolanaAddress(data.subscription)
        ) {
          await onSubmit({ address: data.subscription });
          form.reset(EMPTY_FORM);
          return;
        }

        if (isFarcasterName(data.subscription)) {
          const farcasterDetails =
            await getFarcasterAddressMutation.mutateAsync({
              name: data.subscription,
            });

          if (!farcasterDetails) {
            return;
          }

          if (farcasterDetails.addressSolana) {
            await onSubmit({
              address: farcasterDetails.addressSolana,
              fid: farcasterDetails.fid,
            });
          }

          if (farcasterDetails.address) {
            await onSubmit({
              address: farcasterDetails.address,
              fid: farcasterDetails.fid,
            });
          }

          form.reset(EMPTY_FORM);
          return;
        }

        const ensAddress = await getEnsAddressMutation.mutateAsync({
          ensName: data.subscription,
        });

        if (!ensAddress) {
          return;
        }

        await onSubmit({ address: ensAddress });
        form.reset(EMPTY_FORM);
        setError('');
      } catch {
        setError("We couldn't subscribe to this address. Try again.");
      }
    },

    [
      form,
      onSubmit,
      canSubscribe,
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
              disabled={error !== ''}
              placeholder="e.g., vitalik.eth"
              className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-black shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          );
        }}
      />

      {error !== '' && (
        <ErrorMessage className="mt-1">
          {error === MAX_SUBS_MESSAGE ? (
            <>
              {error}{' '}
              <Link
                size="s"
                isExternal
                href={VAULT_LINK}
                className="border-none px-0 text-sm text-[#ef4444] underline lg:text-sm"
              >
                Lock $IDRISS
              </Link>{' '}
              to access premium.
            </>
          ) : (
            error
          )}
        </ErrorMessage>
      )}
    </form>
  );
};
