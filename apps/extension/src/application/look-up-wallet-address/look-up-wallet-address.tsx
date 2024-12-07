import { useCallback, useState } from 'react';
import { useKey } from 'react-use';
import { SubmitHandler, useForm } from 'react-hook-form';
import { lowerFirst } from 'lodash';

import { Closable } from 'shared/ui';
import { useExtensionSettings } from 'shared/extension';
import { useCommandMutation } from 'shared/messaging';
import {
  GetDigestToWalletAddressCommand,
  GetHandleToTwitterIdCommand,
  getIdrissIdentifierType,
  IDRISS_IDENTIFIER_TYPE,
  normalizePhoneIdentifier,
  normalizeTwitterIdentifier,
} from 'shared/idriss';

import {
  findMatchingAddresses,
  generateDigestedPromises,
  isShortcut,
} from './utils';
import { LookupFormValues, SearchResult } from './types';
import { AddressList, LookupForm } from './components';

const EMPTY_LOOKUP_FORM_VALUES: LookupFormValues = {
  identifier: '',
};

export const LookUpWalletAddress = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [result, setResult] = useState<SearchResult>();
  const foundAddressesCount = Object.values(result?.lookup ?? {}).length;
  const hasFoundNothing = result && foundAddressesCount === 0;
  const hasFoundSomething = result && foundAddressesCount > 0;

  const { extensionSettings } = useExtensionSettings();
  const form = useForm<LookupFormValues>({
    defaultValues: EMPTY_LOOKUP_FORM_VALUES,
  });

  const isEnabled =
    extensionSettings['entire-extension-enabled'] &&
    extensionSettings['wallet-lookup-enabled'];

  const twitterIdsMutation = useCommandMutation(GetHandleToTwitterIdCommand);
  const addressesMutation = useCommandMutation(GetDigestToWalletAddressCommand);

  const reset = useCallback(() => {
    form.reset(EMPTY_LOOKUP_FORM_VALUES);
    setResult(undefined);
  }, [form]);

  const closeWidget = useCallback(() => {
    reset();
    setIsVisible(false);
  }, [reset]);

  const toggleVisibility = useCallback(() => {
    setIsVisible((previous) => {
      return !previous;
    });
  }, []);

  const submit: SubmitHandler<LookupFormValues> = useCallback(
    async (data) => {
      let identifier = lowerFirst(data.identifier).replaceAll(' ', '');
      const identifierType = getIdrissIdentifierType(identifier);
      if (identifierType === IDRISS_IDENTIFIER_TYPE.UNKNOWN) {
        setResult({ identifier, lookup: {} });
        return;
      }

      if (identifierType === IDRISS_IDENTIFIER_TYPE.TWITTER) {
        const twitterIds = await twitterIdsMutation.mutateAsync({
          handles: [identifier],
        });
        const foundTwitterId =
          twitterIds[normalizeTwitterIdentifier(identifier)];

        if (!foundTwitterId) {
          setResult({ identifier, lookup: {} });
          return;
        }
        identifier = foundTwitterId;
      }

      if (identifierType === IDRISS_IDENTIFIER_TYPE.PHONE) {
        identifier = normalizePhoneIdentifier(identifier);
      }

      const digestedMessages = await generateDigestedPromises(identifier);
      const addresses = await addressesMutation.mutateAsync({
        digestedMessages: Object.values(digestedMessages),
      });
      const foundMatches = findMatchingAddresses(addresses, digestedMessages);

      setResult({
        identifier: data.identifier,
        lookup: foundMatches,
      });
      form.reset({ identifier: data.identifier });
    },
    [addressesMutation, form, twitterIdsMutation],
  );

  useKey(isShortcut, toggleVisibility);

  const isLoading = addressesMutation.isPending || twitterIdsMutation.isPending;

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
            onSubmit={submit}
            isLoading={isLoading}
            onReset={reset}
            className="mb-1.5"
          />
          {!form.formState.isDirty && hasFoundSomething && (
            <AddressList onAddressCopied={closeWidget} searchResult={result} />
          )}
          {!form.formState.isDirty && hasFoundNothing && (
            <div className="absolute w-full rounded-lg border border-[#D1D5DB] bg-white p-4 shadow-md">
              <span className="text-[#1F2937]">Nothing found.</span>
            </div>
          )}
        </div>
      </div>
    </Closable>
  );
};
