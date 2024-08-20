import { FormEvent, useRef, useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { Tooltip } from 'shared/ui';

import { GetResolvedAddressCommand, GetTwitterIdsCommand } from '../commands';
interface LastEvent {
  event: FormEvent<HTMLInputElement>;
  timestamp: number;
  input: HTMLInputElement | null;
  value: string;
}

export const App = () => {
  const [username, setUsername] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>();
  const lastEvent = useRef<LastEvent>();

  const twitterIdsQuery = useCommandQuery({
    command: new GetTwitterIdsCommand({
      username,
    }),
  });

  const addressesQuery = useCommandQuery({
    command: new GetResolvedAddressCommand({
      identifier: username,
      twitterId: twitterIdsQuery.data?.twitterIDs
        ? Object.values(twitterIdsQuery.data?.twitterIDs)[0]
        : undefined,
    }),
  });

  const checkInputChanged = () => {
    if (
      lastEvent.current?.input &&
      Date.now() - lastEvent.current.timestamp >= 500 &&
      lastEvent.current.input.value === lastEvent.current.value &&
      lastEvent.current.value.length >= 3
    ) {
      setUsername(lastEvent.current.value);
    }
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    const eventTarget = event.target as HTMLInputElement;
    lastEvent.current = {
      event: event,
      timestamp: Date.now(),
      input: eventTarget,
      value: eventTarget?.value,
    };

    setInputValue(eventTarget.value);
    setTimeout(() => {
      void checkInputChanged();
    }, 500);
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

        {inputValue && inputValue.length > 0 && (
          <>
            {addressesQuery.data?.result &&
              Object.entries(addressesQuery.data.result).length > 0 && (
                <div className="absolute max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 text-black">
                  {Object.entries(addressesQuery.data.result)?.map(
                    ([key, value]) => {
                      return (
                        <Tooltip
                          tooltipMessage="Copied address!"
                          key={key + value}
                        >
                          <div
                            className="cursor-pointer select-none border-b border-b-stone-300 px-2 hover:bg-gray-200"
                            onClick={() => {
                              void navigator.clipboard.writeText(value);
                            }}
                          >
                            <span className="text-sm font-bold">{key}</span>
                            <span className="text-sm text-[#8adf85]">
                              {addressesQuery.data?.input}
                            </span>
                            <p className="text-xs font-thin">{value}</p>
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
