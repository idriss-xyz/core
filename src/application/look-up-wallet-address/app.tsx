import { FormEvent, useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

import { useCommandQuery } from 'shared/messaging';
import { Closable, IconButton, Spinner } from 'shared/ui';
import { useExtensionSettings } from 'shared/extension';

import { GetResolvedAddressCommand, GetTwitterIdsCommand } from './commands';
import { AddressList } from './address-list';

export const App = () => {
  const [username, setUsername] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const { extensionSettings } = useExtensionSettings();

  const isEnabled =
    extensionSettings['entire-extension-enabled'] &&
    extensionSettings['block-explorers-enabled'];

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

  useDebounce(
    () => {
      setUsername(inputValue);
    },
    500,
    [inputValue],
  );

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const eventTarget = event.target as HTMLInputElement;
    setInputValue(eventTarget.value);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'i') {
        setVisible((previous) => {
          return !previous;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!visible || !isEnabled) {
    return null;
  }

  return (
    <Closable
      className="fixed right-2 top-2 z-[9990] p-0"
      onClose={() => {
        return setVisible(false);
      }}
    >
      <div className="w-[470px] rounded-md bg-white px-2 py-3">
        <div className="relative">
          <label
            htmlFor="first_name"
            className="mb-1 block text-xs text-gray-700"
          >
            Look up your wallet address
          </label>
          <input
            autoFocus
            id="first_name"
            className="mb-1.5 box-border block h-[38px] w-full rounded border border-[#cccccc] bg-white px-3 py-2 align-middle font-sans text-sm leading-[1.428571429] text-[#333333] outline-none"
            placeholder="hello@idriss.xyz  |  +1 650...  |  @IDriss_xyz"
            onChange={(event) => {
              return handleInput(event);
            }}
            value={inputValue}
          />
          {!addressesQuery.isLoading && inputValue.length > 0 && (
            <IconButton
              iconProps={{ name: 'Cross1Icon' }}
              className="absolute right-2 top-1/2 text-black transition-transform hover:scale-90"
              onClick={() => {
                return setInputValue('');
              }}
            />
          )}
          {addressesQuery.isLoading && (
            <div className="absolute right-2 top-1/2 flex size-6 items-center">
              <Spinner className="h-4" />
            </div>
          )}
          {inputValue?.length > 0 && (
            <>
              <AddressList
                onAddressCopied={() => {
                  setVisible(false);
                }}
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
