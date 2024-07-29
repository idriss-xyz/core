import { ExternalProvider, JsonRpcSigner } from '@ethersproject/providers';
import { ContractInterface, ethers } from 'ethers';
import { EIP1193Provider } from 'mipd';
import { getAddress } from 'ethers/lib/utils';
import { IdrissCrypto } from 'idriss-crypto/lib/browser';

import { Hex, Wallet } from './types';
import { NATIVE_COIN_ADDRESS } from './constants';

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

export const createRandomWallet = () => {
  const temporaryWallet = ethers.Wallet.createRandom();
  return temporaryWallet;
};

export const createSigner = (wallet: Wallet) => {
  const ethersProvider = createEthersProvider(wallet.provider);
  const signer = ethersProvider.getSigner(wallet.account);

  return signer;
};

export const createContract = (options: {
  address: string;
  abi: ContractInterface;
  signerOrProvider?: JsonRpcSigner | string;
}) => {
  return new ethers.Contract(
    options.address,
    options.abi,
    typeof options.signerOrProvider === 'string'
      ? new ethers.providers.JsonRpcProvider(options.signerOrProvider)
      : options.signerOrProvider,
  );
};

export const toAddressWithValidChecksum = (address: Hex) => {
  return getAddress(address) as Hex;
};

const ethToWei = (amount: number) => {
  return amount * 10 ** 18;
};

export const weiToEth = (amount: number) => {
  return amount / 10 ** 18;
};

export const dollarToWei = (amount: number, ethPerDollar: number) => {
  return Math.floor(ethToWei(ethPerDollar * amount));
};

const ethToRawDollars = (amount: number, ethPerDollar: number) => {
  return amount / ethPerDollar;
};

export const ethToDollars = (amount: number, ethPerDollar: number) => {
  return Number(ethToRawDollars(amount, ethPerDollar).toFixed(2));
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

export const applyDecimalsToNumericString = (
  numericString: string,
  decimals: number,
): string => {
  // Check if the number string is valid
  if (!/^\d+$/.test(numericString)) {
    throw new Error('Invalid number string');
  }

  // If decimals is 0, return the number string as is
  if (decimals === 0) {
    return numericString;
  }

  // Calculate the position to insert the decimal point
  const length_ = numericString.length;
  const decimalPos = length_ - decimals;

  // If the position is less than or equal to 0, we need to pad with zeros at the start
  if (decimalPos <= 0) {
    return '0.' + '0'.repeat(Math.abs(decimalPos)) + numericString;
  }

  // Otherwise, insert the decimal point at the calculated position
  return (
    numericString.slice(0, decimalPos) + '.' + numericString.slice(decimalPos)
  );
};

export const isNativeTokenAddress = (tokenAddress: Hex) => {
  return tokenAddress === NATIVE_COIN_ADDRESS;
};
