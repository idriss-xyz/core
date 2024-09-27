import React, { useCallback, useEffect, useState } from 'react';
import { useKey } from 'react-use';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Closable } from 'shared/ui';
import { useExtensionSettings } from 'shared/extension';

import { AddressList } from './components/address-list';
import {
  findMatchingAddresses,
  formatIdentifier,
  generateDigestedPromises,
  isShortcut,
  useAddressesQuery,
  useTwitterIdsQuery,
} from './utils';
import { LookupFormValues } from './types';
import { LookupForm } from './components/look-up-form';

interface MatchedAddresses {
  input: string;
  result: Record<string, string>;
  twitterID?: string;
}

const EMPTY_LOOKUP_FORM_VALUES: LookupFormValues = {
  userIdentifier: '',
};

export const LookUpWalletAddress: React.FC = () => {
  const [handle, setHandle] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [matchedAddresses, setMatchedAddresses] = useState<MatchedAddresses>();
  const [digestedMessages, setDigestedMessages] =
    useState<Record<string, string>>();

  const { extensionSettings } = useExtensionSettings();
  const form = useForm<LookupFormValues>({
    defaultValues: EMPTY_LOOKUP_FORM_VALUES,
  });

  const userIdentifier = form.watch('userIdentifier');
  const isEnabled =
    extensionSettings['entire-extension-enabled'] &&
    extensionSettings['wallet-lookup-enabled'];

  const twitterIdsQuery = useTwitterIdsQuery(handle);
  const addressesQuery = useAddressesQuery(digestedMessages);

  const fetchDigestedMessages = useCallback(
    async (network = '', coin = '') => {
      try {
        const identifier = formatIdentifier(handle, twitterIdsQuery.data);
        if (!identifier) {
          setDigestedMessages(undefined);
          return;
        }

        const digestedPromises = await generateDigestedPromises(
          identifier,
          network,
          coin,
        );
        setDigestedMessages(digestedPromises);
      } catch (error) {
        console.error(error);
      }
    },
    [handle, twitterIdsQuery.data],
  );

  const matchDigestedMessages = useCallback(() => {
    if (!addressesQuery?.data || !digestedMessages) {
      setMatchedAddresses(undefined);
      return;
    }

    const foundMatches = findMatchingAddresses(
      addressesQuery.data,
      digestedMessages,
    );
    const formattedHandle = handle.startsWith('@') ? handle.slice(1) : handle;

    const result = {
      input: formattedHandle,
      result: foundMatches,
      ...(twitterIdsQuery.data?.[formattedHandle] && { twitterID: handle }),
    };

    setMatchedAddresses(result);
  }, [addressesQuery.data, digestedMessages, handle, twitterIdsQuery.data]);

  const onSubmit: SubmitHandler<LookupFormValues> = (data) => {
    setHandle(data.userIdentifier);
    setDigestedMessages(undefined);
    setMatchedAddresses(undefined);
  };

  const resetComponentState = () => {
    form.reset(EMPTY_LOOKUP_FORM_VALUES);
    setHandle('');
    setDigestedMessages(undefined);
    setMatchedAddresses(undefined);
  };

  const closeWidget = () => {
    setIsVisible(false);
    resetComponentState();
  };

  const toggleVisibility = () => {
    setIsVisible((previous) => {
      return !previous;
    });
  };

  useEffect(() => {
    if (!twitterIdsQuery.isLoading && handle.length >= 3) {
      void fetchDigestedMessages();
    }
  }, [fetchDigestedMessages, handle.length, twitterIdsQuery.isLoading]);

  useEffect(() => {
    if (addressesQuery?.data) {
      matchDigestedMessages();
    }
  }, [addressesQuery?.data, matchDigestedMessages]);

  useKey(isShortcut, toggleVisibility);

  if (!isVisible || !isEnabled) {
    return null;
  }

  return (
    <Closable
      className="fixed right-6 top-6 z-[9990] p-0"
      onClose={closeWidget}
    >
      <div className="w-[470px] rounded-md bg-white px-2 py-3">
        <div className="relative">
          <LookupForm
            form={form}
            onSubmit={onSubmit}
            userIdentifier={userIdentifier}
            isLoading={addressesQuery.isLoading || twitterIdsQuery.isLoading}
            onReset={resetComponentState}
          />
          <AddressList
            onAddressCopied={closeWidget}
            foundAddresses={matchedAddresses?.result}
            isTwitterLookup={!!matchedAddresses?.twitterID}
            lookupText={matchedAddresses?.input}
          />
        </div>
      </div>
    </Closable>
  );
};
