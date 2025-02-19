import { normalize } from 'viem/ens';

import { FormPayload } from './schema';
import { ethereumClient } from './config';

export const getSendFormDefaultValues = (
  defaultChainId: number,
  defaultTokenSymbol: string,
): FormPayload => {
  return {
    amount: 1,
    chainId: defaultChainId,
    tokenSymbol: defaultTokenSymbol,
    message: '',
  };
};

export const validateAddressOrENS = async (addressOrENS: string | null) => {
  if (addressOrENS === null) return null;
  if (addressOrENS.includes('.')) {
    return ethereumClient?.getEnsAddress({
      name: normalize(addressOrENS),
    });
  }
  return addressOrENS;
};
