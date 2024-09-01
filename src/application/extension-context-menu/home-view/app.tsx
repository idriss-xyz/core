import { FormEvent, useState } from 'react';
import { useDebounce } from 'react-use';

import { useCommandQuery } from 'shared/messaging';
import { Icon, Tooltip } from 'shared/ui';

import { GetResolvedAddressCommand, GetTwitterIdsCommand } from '../commands';

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
            {addressesQuery.data?.result &&
              Object.entries(addressesQuery.data.result).length > 0 && (
                <div className="absolute max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 text-black [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
                  {Object.entries(addressesQuery.data.result)?.map(
                    ([key, value]) => {
                      return (
                        <Tooltip
                          tooltipMessage="Copied address!"
                          key={key + value}
                        >
                          <div className="flex cursor-pointer select-none justify-between border-b border-b-stone-300 px-2 hover:bg-gray-200">
                            <div
                              className="flex-col justify-between"
                              onClick={() => {
                                void navigator.clipboard.writeText(value);
                              }}
                            >
                              <div className="flex gap-1.5">
                                <span className="text-sm font-bold">{key}</span>
                                <span className="text-sm text-[#8adf85]">
                                  {addressesQuery.data?.input}
                                </span>
                              </div>
                              <p className="text-xs font-thin">{value}</p>
                            </div>
                            {addressesQuery.data?.twitterID && (
                              <Icon
                                size={16}
                                name="TwitterLogoIcon"
                                className="mt-1 text-twitter-primary [&>path]:fill-rule-non-zero"
                              />
                            )}
                          </div>
                        </Tooltip>
                      );
                    },
                  )}
                </div>
              )}
            {addressesQuery.data?.result &&
              Object.entries(addressesQuery.data.result).length === 0 && (
                <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
                  <span className="text-gray-800">Nothing found.</span>
                  <a
                    href="https://www.idriss.xyz"
                    target="_blank"
                    className="ml-2 text-blue-600 hover:underline"
                    rel="noreferrer"
                  >
                    Sign up for IDriss now!
                  </a>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};
