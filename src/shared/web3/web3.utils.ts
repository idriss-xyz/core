import { ExternalProvider, JsonRpcSigner } from '@ethersproject/providers';
import { ContractInterface, ethers } from 'ethers';
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

export const decimalToHex = (value: number): Hex => {
  return `0x${value.toString(16)}`;
};

export const hexToDecimal = (hex: Hex) => {
  return Number.parseInt(hex);
};

export const createEthersProvider = (provider: EIP1193Provider) => {
  return new ethers.providers.Web3Provider(provider as ExternalProvider);
};

export const createContract = (options: {
  address: string;
  abi: ContractInterface;
  signer: JsonRpcSigner;
}) => {
  return new ethers.Contract(options.address, options.abi, options.signer);
};

export const toAddressWithValidChecksum = (address: Hex) => {
  return getAddress(address) as Hex;
};

export const dollarToWei = (amount: number, oneDollarPriceInEth: number) => {
  return Math.floor(oneDollarPriceInEth * amount * 10 ** 18);
};

export const roundToSignificantFigures = (
  number: number,
  significantFigures: number,
): number => {
  if (number === 0) {
    return 0;
  }

  const multiplier = Math.pow(
    10,
    significantFigures - Math.floor(Math.log10(Math.abs(number))) - 1,
  );
  return Math.round(number * multiplier) / multiplier;
};
