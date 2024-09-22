import { useState } from 'react';
import { useKey } from 'react-use';
import { useForm } from 'react-hook-form';

import { useCommandQuery } from 'shared/messaging';
import { Closable, IconButton, Spinner } from 'shared/ui';
import { useExtensionSettings } from 'shared/extension';

import { GetResolvedAddressCommand, GetTwitterIdsCommand } from './commands';
import { AddressList } from './address-list';

export const LookUpWalletAddress = () => {
  const [username, setUsername] = useState('');
  const [visible, setVisible] = useState(false);

  const { extensionSettings } = useExtensionSettings();

  const isEnabled =
    extensionSettings['entire-extension-enabled'] &&
    extensionSettings['wallet-lookup-enabled'];

  const twitterIdsQuery = useCommandQuery({
    command: new GetTwitterIdsCommand({
      username,
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });

  const addressesQuery = useCommandQuery({
    command: new GetResolvedAddressCommand({
      identifier: username,
      twitterId: twitterIdsQuery.data?.twitterIDs
        ? Object.values(twitterIdsQuery.data?.twitterIDs)[0]
        : undefined,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: username.length >= 3,
  });

  const form = useForm();

  const userIdentifier = form.watch('user_identifier');

  const onSubmit = () => {
    const values = form.getValues();
    setUsername(values.user_identifier);
  };

  const closeWidget = () => {
    setVisible(false);
    form.reset();
  };

  useKey(
    (event) => {
      return event.ctrlKey && event.key === 'i';
    },
    () => {
      return setVisible((previous) => {
        return !previous;
      });
    },
  );

  if (!visible || !isEnabled) {
    return null;
  }

  return (
    <Closable
      className="fixed right-6 top-6 z-[9990] p-0"
      onClose={closeWidget}
    >
      <div className="w-[470px] rounded-md bg-white px-2 py-3">
        <div className="relative">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <label
              htmlFor="user_identifier"
              className="mb-1 block text-xs text-gray-700"
            >
              Look up your wallet address
            </label>
            <div className="flex flex-row gap-x-[10px]">
              <div className="relative grow">
                <input
                  autoFocus
                  id="user_identifier"
                  className="mb-1.5 box-border block h-[38px] w-full rounded border border-[#cccccc] bg-white py-2 pl-3 pr-10 align-middle font-sans text-sm text-[#333333] outline-none"
                  placeholder="hello@idriss.xyz  |  +1 650...  |  @IDriss_xyz"
                  {...form.register('user_identifier')}
                />
                {!addressesQuery.isLoading && userIdentifier?.length > 0 && (
                  <IconButton
                    iconProps={{ name: 'Cross1Icon' }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-black transition-transform hover:scale-90"
                    onClick={() => {
                      form.reset();
                    }}
                  />
                )}
                {addressesQuery.isLoading && (
                  <div className="absolute right-2 top-1/2 flex size-6 items-center">
                    <Spinner className="h-4" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="h-[38px] w-20 rounded-md bg-idriss-primary-500 py-2 text-base font-medium text-white shadow-sm hover:bg-idriss-primary-400"
              >
                Search
              </button>
            </div>
          </form>

          {userIdentifier?.length > 0 && (
            <>
              <AddressList
                onAddressCopied={closeWidget}
                foundAddresses={addressesQuery?.data?.result}
                isTwitterLookup={!!addressesQuery?.data?.twitterID}
                lookupText={addressesQuery?.data?.input}
              />
            </>
          )}
        </div>
      </div>
    </Closable>
  );
};
