import { ExternalProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { EIP1193Provider } from 'mipd';
import { getAddress } from 'ethers/lib/utils';
import { IdrissCrypto } from 'idriss-crypto/lib/browser';

import { Hex } from './web3.types';

export const resolveAddress = async (address: string) => {
  const idriss = new IdrissCrypto();
  const idrissResolved: string = await idriss.reverseResolve(address);
  if (idrissResolved.length > 0) {
    return idrissResolved;
  }

  return;
};

export const numberToHexString = (value: number) => {
  return `0x${value.toString(16)}`;
};

export const hexStringToNumber = (hex: string) => {
  return Number.parseInt(hex);
};

export const createEthersProvider = (provider: EIP1193Provider) => {
  return new ethers.providers.Web3Provider(provider as ExternalProvider);
};

export const toAddressWithValidChecksum = (address: Hex) => {
  return getAddress(address) as Hex;
};
