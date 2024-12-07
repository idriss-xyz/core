import { walletTags } from './constants';

const digestMessage = async (message: string) => {
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

export const generateDigestedPromises = async (identifier: string) => {
  const digestedPromises: Record<string, string> = {};
  for (const coins of Object.values(walletTags)) {
    for (const tags of Object.values(coins)) {
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
