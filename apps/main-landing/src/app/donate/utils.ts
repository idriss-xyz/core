import { normalize } from 'viem/ens';

import { FormPayload } from './schema';
import { ethereumClient } from './config';

export const getSendFormDefaultValues = (
  defaultChainId: number,
  defaultTokenSymbol: string,
): FormPayload => {
  return {
    amount: 1,
    tokenAmount: 1,
    collectibleAmount: 1,
    message: '',
    sfx: '',
    chainId: defaultChainId,
    tokenSymbol: defaultTokenSymbol,
    type: 'token',
  };
};

export const validateAddressOrENS = async (addressOrENS: string | null) => {
  if (addressOrENS === null) {
    return null;
  }

  if (addressOrENS.includes('.')) {
    return ethereumClient?.getEnsAddress({
      name: normalize(addressOrENS),
    });
  }

  return addressOrENS;
};

export const removeMainnetSuffix = (text: string) => {
  const suffix = '_MAINNET';

  if (text.endsWith(suffix)) {
    return text.slice(0, -suffix.length);
  }

  return text;
};
