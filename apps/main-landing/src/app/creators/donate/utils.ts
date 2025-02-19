import { normalize } from 'viem/ens';

import { CHAIN, NATIVE_COIN_ADDRESS } from './constants';
import { FormPayload } from './schema';
import { Hex } from './types';
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

export const getChainById = (chainId: number) => {
  return Object.values(CHAIN).find((chain) => {
    return chain.id === chainId;
  });
};

export const isUnrecognizedChainError = (error: unknown) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 4902
  );
};

export const getSafeNumber = (
  number: number,
): { value: number; decimals: number } => {
  // Convert the number to a string and split by the decimal point, adjust for european style of decimal
  const numberString = number.toString().replace(',', '.');

  // Check if there is a decimal point in the number
  if (numberString.includes('.')) {
    const parts = numberString.split('.');
    const decimals = parts[1]?.length ?? 0;
    const value = number * 10 ** decimals;
    return { value: Math.floor(value), decimals };
  } else {
    // If no decimal point, the number is an integer
    const value = Number.parseInt(numberString, 10);
    return { value, decimals: 0 };
  }
};

export const isNativeTokenAddress = (tokenAddress: Hex) => {
  return tokenAddress === NATIVE_COIN_ADDRESS;
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

const getBlockExplorers = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.blockExplorers;
};

const getDefaultBlockExplorerUrl = (chainId: number) => {
  return getBlockExplorers(chainId)?.default.url;
};

export const getTransactionUrl = (properties: {
  chainId: number;
  transactionHash: Hex;
}) => {
  const { chainId, transactionHash } = properties;
  const baseUrl = getDefaultBlockExplorerUrl(chainId);
  if (!baseUrl) {
    return '#';
  }
  return `${baseUrl}/tx/${transactionHash}`;
};

export const getTransactionUrls = ({
  chainId,
  transactionHash,
}: {
  chainId: number;
  transactionHash: string;
}) => {
  const blockExplorers = getBlockExplorers(chainId);

  if (!blockExplorers) {
    return [];
  }

  return Object.keys(blockExplorers).map((key) => {
    const explorer = blockExplorers[key as keyof typeof blockExplorers];
    const url = explorer.url;

    return {
      blockExplorer: explorer.name,
      url: `${url}/tx/${transactionHash}`,
    };
  });
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
