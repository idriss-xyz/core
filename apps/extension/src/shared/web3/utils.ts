import {
  createWalletClient as createViemWalletClient,
  custom,
  getAddress,
  Hex,
  parseEther,
  publicActions,
} from 'viem';
import { IdrissCrypto } from 'idriss-crypto/lib/browser';
import { getChainById } from '@idriss-xyz/utils';
import { Wallet } from '@idriss-xyz/wallet-connect';

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

export const toAddressWithValidChecksum = (address: Hex) => {
  return getAddress(address);
};

export const dollarToWei = (amount: number, ethPerDollar: number) => {
  return Math.floor(Number(parseEther(`${ethPerDollar * amount}`)));
};

const ethToRawDollars = (amount: number, ethPerDollar: number) => {
  return amount / ethPerDollar;
};

export const ethToDollars = (amount: number, ethPerDollar: number) => {
  return Number(ethToRawDollars(amount, ethPerDollar).toFixed(2));
};

export const getWholeNumber = (number: string): number | string => {
  if (number?.includes('e')) {
    const scienceNumberArray = number.toString().split('e-');
    const decimals = scienceNumberArray?.[1] ?? '2';
    const startingDecimals =
      scienceNumberArray?.[0]?.split('.')?.[1]?.length ?? 0;
    return Number(number).toFixed(Number(decimals) + Number(startingDecimals));
  }
  return Number(number);
};

export const getRpcUrl = (chainId: number) => {
  const chain = getChainById(chainId);
  return chain?.rpcUrls.default.http[0] ?? '#';
};
