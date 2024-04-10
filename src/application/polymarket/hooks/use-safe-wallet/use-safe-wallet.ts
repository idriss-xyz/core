import { Wallet } from 'shared/web3';

export const getSafeWalletQueryKey = (wallet?: Wallet) => {
  return ['getSafeWallet', wallet?.account, wallet?.chainId];
};
