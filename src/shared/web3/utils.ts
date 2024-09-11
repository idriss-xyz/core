import { mainnet } from 'viem/chains';
import {
  createWalletClient as createViemWalletClient,
  custom,
  getAddress,
  publicActions,
} from 'viem';
import { IdrissCrypto } from 'idriss-crypto/lib/browser';

import { Hex, Wallet } from './types';
import { CHAIN, NATIVE_COIN_ADDRESS } from './constants';

export const resolveAddress = async (address: string) => {
  const idriss = new IdrissCrypto();
  const idrissResolved: string = await idriss.reverseResolve(address);
  if (idrissResolved.length > 0) {
    return idrissResolved;
  }

  return;
};

export const createWalletClient = (
  wallet: Pick<Wallet, 'account' | 'provider'>,
) => {
  return createViemWalletClient({
    transport: custom(wallet.provider),
    account: wallet.account,
  }).extend(publicActions);
};

export const hexToDecimal = (hex: Hex) => {
  return Number.parseInt(hex);
};

// TODO: to be removed
export const createSigner = ({
  provider,
  account,
}: Pick<Wallet, 'provider' | 'account'>) => {
  return createViemWalletClient({
    chain: mainnet,
    transport: custom(provider),
    account,
  });
};

export const toAddressWithValidChecksum = (address: Hex) => {
  return getAddress(address);
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

export const getChainById = (chainId: number) => {
  return Object.values(CHAIN).find((chain) => {
    return chain.id === chainId;
  });
};

const getBlockExplorer = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.blockExplorers.default;
};

export const getBlockExplorerUrl = (chainId: number) => {
  return getBlockExplorer(chainId)?.url;
};

export const getTransactionUrl = (properties: {
  chainId: number;
  transactionHash: Hex;
}) => {
  const { chainId, transactionHash } = properties;
  const baseUrl = getBlockExplorerUrl(chainId);
  if (!baseUrl) {
    return '#';
  }
  return `${baseUrl}/tx/${transactionHash}`;
};

export const getRpcUrl = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.rpcUrls.default.http[0] ?? '#';
};
