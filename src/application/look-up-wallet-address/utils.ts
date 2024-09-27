import { useCommandQuery } from 'shared/messaging';
import {
  GetDigestToWalletAddressCommand,
  GetHandleToTwitterIdCommand,
} from 'shared/idriss';

import { regM, regPh, regT, walletTags } from './constants';

export const generateGetTwitterIdsQuery = ({
  username,
}: {
  username: string;
}) => {
  return `https://www.idriss.xyz/v1/getTwitterIDPlugin?usernames=${username}`;
};

export const lowerFirst = (value: string) => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

export const convertPhone = (phone: string) => {
  // allow for letters because secret word can follow phone number
  return '+' + phone.replace(/[^\dA-Za-z]/, '');
};

export const digestMessage = async (message: string) => {
  const messageUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageUint8); // hash the message
  const hashArray = [...new Uint8Array(hashBuffer)]; // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join(''); // convert bytes to hex string
  return hashHex;
};

export const isShortcut = (event: KeyboardEvent) => {
  return event.ctrlKey && event.key === 'i';
};

export const formatIdentifier = (
  handle: string,
  twitterIds: Record<string, string | null> | undefined,
) => {
  let identifier = lowerFirst(handle).replaceAll(' ', '');
  if (regPh.test(identifier)) {
    identifier = convertPhone(identifier);
  } else if (!regM.test(identifier) && !regT.test(identifier)) {
    console.error(
      'Not a valid input. Input must start with valid phone number, email, or @twitter handle.',
    );
    return null;
  }
  if (regT.test(identifier)) {
    const formattedHandle = handle.startsWith('@') ? handle.slice(1) : handle;
    identifier = twitterIds?.[formattedHandle] ?? 'Not found';
    if (!identifier || identifier === 'Not found') {
      console.error('Twitter handle not found.');
      return null;
    }
  }
  return identifier;
};

export const generateDigestedPromises = async (
  identifier: string,
  network = '',
  coin = '',
) => {
  const digestedPromises: Record<string, string> = {};
  for (const [network_, coins] of Object.entries(walletTags)) {
    if (network && network_ !== network) continue;
    for (const [coin_, tags] of Object.entries(coins)) {
      if (coin && coin_ !== coin) continue;
      for (const [tag_, tag_key] of Object.entries(tags)) {
        if (tag_key && typeof tag_key === 'string') {
          digestedPromises[tag_] = await digestMessage(identifier + tag_key);
        }
      }
    }
  }
  return digestedPromises;
};

export const findMatchingAddresses = (
  addressesData: Record<string, string>,
  digestedMessages: Record<string, string>,
) => {
  const foundMatches: Record<string, string> = {};
  for (const [hash, result] of Object.entries(addressesData)) {
    if (result && result !== '') {
      const hashEntry = Object.entries(digestedMessages).find(
        ([_key, value]) => {
          return value === hash;
        },
      );
      if (hashEntry) {
        const [hashKey, _hashValue] = hashEntry;
        foundMatches[hashKey] = result;
      }
    }
  }
  return foundMatches;
};

export const useTwitterIdsQuery = (handle: string) => {
  return useCommandQuery({
    command: new GetHandleToTwitterIdCommand({
      handles: [handle],
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: handle?.length >= 3,
  });
};

export const useAddressesQuery = (
  digestedMessages: Record<string, string> | undefined,
) => {
  return useCommandQuery({
    command: new GetDigestToWalletAddressCommand({
      digestedMessages: Object.values(digestedMessages ?? {}),
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!digestedMessages,
  });
};
