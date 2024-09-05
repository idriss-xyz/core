import { FormEvent, useState } from 'react';
import { useDebounce } from 'react-use';

import { useCommandQuery } from 'shared/messaging';

import { GetResolvedAddressCommand, GetTwitterIdsCommand } from '../commands';

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
    <div className="shrink-0 grow p-10">
      <div className="relative">
        <label
          htmlFor="first_name"
          className="mb-1 block text-xs text-gray-700"
        >
          Look up your wallet address
        </label>
        <input
          autoFocus
          type="text"
          id="first_name"
          className="mb-1.5 box-border block h-[38px] w-full rounded border border-[#cccccc] bg-white px-3 py-2 align-middle font-sans text-sm leading-[1.428571429] text-[#333333] outline-none"
          placeholder="hello@idriss.xyz  |  +1 650...  |  @IDriss_xyz"
          onChange={(event) => {
            return handleInput(event);
          }}
        />

        {inputValue?.length > 0 && (
          <>
            {addressesQuery.data?.result && (
              <AddressList
                foundAddresses={addressesQuery.data.result}
                isTwitterLookup={!!addressesQuery.data.twitterID}
                lookupText={addressesQuery.data.input}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
