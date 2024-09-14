import { FormEvent, useState } from 'react';
import { useDebounce } from 'react-use';

import { useCommandQuery } from 'shared/messaging';
import { Closable, IconButton } from 'shared/ui';

import { GetResolvedAddressCommand, GetTwitterIdsCommand } from './commands';
import { AddressList } from './address-list';

export const App = () => {
  const [username, setUsername] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');

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

  return (
    <Closable>
      <div className="fixed right-6 top-[400px] w-[550px] rounded-md bg-white px-2 py-3">
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
          {inputValue.length > 0 && (
            <IconButton
              iconProps={{ name: 'Cross1Icon' }}
              className="absolute right-2 top-1/2 text-black transition-transform hover:scale-90"
              onClick={() => {
                return setInputValue('');
              }}
            />
          )}

          {inputValue?.length > 0 && (
            <>
              <AddressList
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
