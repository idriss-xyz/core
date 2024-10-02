import { useCallback, useEffect, useState } from 'react';

import { classes, Icon, ScrollArea } from 'shared/ui';

import { SearchResult } from '../types';

type AddressListProperties = {
  searchResult: SearchResult;
  onAddressCopied: () => void;
};

type ResultEntry = {
  chain: string;
  address: string;
};

export const AddressList = ({
  searchResult,
  onAddressCopied,
}: AddressListProperties) => {
  const [copiedResult, setCopiedResult] = useState<ResultEntry>();
  const isTwitterLookup = searchResult.identifier.startsWith('@');
  const normalizedIdentifier = isTwitterLookup
    ? searchResult.identifier.replace('@', '')
    : searchResult.identifier;

  const handleAddressClick = useCallback(
    (properties: { chain: string; address: string }) => {
      const { chain, address } = properties;
      void navigator.clipboard.writeText(address);
      setCopiedResult({ chain, address });
    },
    [],
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copiedResult) {
      timeout = setTimeout(() => {
        setCopiedResult(undefined);
        onAddressCopied();
      }, 750);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [copiedResult, onAddressCopied]);

  const isCopiedAddress = useCallback(
    (entry: ResultEntry) => {
      return (
        entry.address === copiedResult?.address &&
        entry.chain === copiedResult.chain
      );
    },
    [copiedResult?.address, copiedResult?.chain],
  );

  return (
    <div className="absolute w-full">
      <ScrollArea className="max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 bg-white text-black shadow-[inset_0_4px_4px_-6px_rgba(229,231,235,1),_inset_0_-4px_4px_-6px_rgba(229,231,235,1)] transition-all duration-500 [scrollbar-color:gray_#efefef] [scrollbar-width:thin]">
        {Object.entries(searchResult.lookup).map(([chain, address]) => {
          const isCopied = isCopiedAddress({ chain, address });

          return (
            <div
              onClick={() => {
                return handleAddressClick({ chain, address });
              }}
              key={chain + address}
              className={classes(
                'flex h-11 cursor-pointer select-none items-center justify-between border-b border-b-stone-100 bg-white px-2 hover:bg-gray-200',
                isCopied && 'bg-green-100 hover:bg-green-200',
              )}
            >
              {isCopied ? (
                <span className="text-sm font-bold">Address copied!</span>
              ) : (
                <>
                  <div className="flex-col justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-sm font-semibold">{chain}</span>
                      <span className="text-sm font-semibold text-[#8adf85]">
                        {normalizedIdentifier}
                      </span>
                    </div>
                    <p className="text-xs font-thin">{address}</p>
                  </div>
                  {isTwitterLookup && (
                    <Icon
                      size={16}
                      name="TwitterLogoIcon"
                      className="mt-1 text-twitter-primary [&>path]:fill-rule-non-zero"
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
};
