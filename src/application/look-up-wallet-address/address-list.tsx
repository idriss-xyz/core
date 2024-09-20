import { useCallback, useEffect, useState } from 'react';

import { classes, Icon } from 'shared/ui';
interface AddressListProperties {
  lookupText: string | undefined;
  foundAddresses: Record<string, string> | undefined;
  isTwitterLookup: boolean;
  onAddressCopied: () => void;
}
export const AddressList = ({
  foundAddresses,
  isTwitterLookup,
  lookupText,
  onAddressCopied,
}: AddressListProperties) => {
  const [copiedAddressValue, setCopiedAddressValue] = useState<string>();

  const handleAddressClick = useCallback((address: string) => {
    void navigator.clipboard.writeText(address);
    setCopiedAddressValue(address);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copiedAddressValue) {
      timeout = setTimeout(() => {
        setCopiedAddressValue(undefined);
        onAddressCopied();
      }, 750);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copiedAddressValue, onAddressCopied]);

  return (
    <>
      <div
        className={classes(
          'absolute w-full overflow-y-auto rounded-md bg-white text-black shadow-[inset_0_4px_4px_-6px_rgba(229,231,235,1),_inset_0_-4px_4px_-6px_rgba(229,231,235,1)] transition-all duration-500 [scrollbar-color:gray_#efefef] [scrollbar-width:thin]',
          foundAddresses &&
            Object.entries(foundAddresses).length > 0 &&
            'max-h-40 border border-gray-300 py-0.5 duration-500',
          (!foundAddresses || Object.entries(foundAddresses).length === 0) &&
            'invisible max-h-0 duration-100',
        )}
      >
        {foundAddresses &&
          Object.entries(foundAddresses)?.map(([key, value]) => {
            return (
              <div
                onClick={() => {
                  return handleAddressClick(value);
                }}
                key={key + value}
                className={classes(
                  'flex h-11 cursor-pointer select-none justify-between border-b border-b-stone-100 bg-white px-2 py-1 hover:bg-gray-200',
                  copiedAddressValue === value &&
                    'bg-green-100 hover:bg-green-200',
                )}
              >
                {copiedAddressValue === value ? (
                  <span className="text-sm font-bold">Copied address!</span>
                ) : (
                  <div className="flex-col justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-sm font-bold">{key}</span>
                      <span className="text-sm text-[#8adf85]">
                        {lookupText}
                      </span>
                    </div>
                    <p className="text-xs font-thin">{value}</p>
                  </div>
                )}
                {isTwitterLookup && (
                  <Icon
                    size={16}
                    name="TwitterLogoIcon"
                    className="mt-1 text-twitter-primary [&>path]:fill-rule-non-zero"
                  />
                )}
              </div>
            );
          })}
      </div>
      {foundAddresses && Object.entries(foundAddresses).length === 0 && (
        <div className="absolute w-full rounded-lg border border-gray-300 bg-white p-4 shadow-md">
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
  );
};
