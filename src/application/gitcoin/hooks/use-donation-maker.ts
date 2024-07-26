import { useCallback } from 'react';

import { Wallet, dollarToWei, useSwitchChain } from 'shared/web3';

import { DonateParameters } from '../types';

import { useAcrossDonateTransaction } from './use-across-donate-transaction';
import { useDonateTransaction } from './use-donate-transaction';

interface Properties {
  wallet?: Wallet;
}

export const useDonationMaker = ({ wallet }: Properties) => {
  const switchChain = useSwitchChain();
  const donateTransaction = useDonateTransaction();
  const acrossDonateTransaction = useAcrossDonateTransaction();

  const donate = useCallback(
    async ({ options, application, ethPerDollar }: DonateParameters) => {
      if (!wallet) {
        return;
      }

      await switchChain.mutateAsync({
        chainId: options.chainId,
        walletProvider: wallet.provider,
      });

      const userAmountInWei = dollarToWei(options.amount, ethPerDollar);

      if (options.chainId === application.chainId) {
        donateTransaction.mutate({
          userAmountInWei,
          application,
          wallet,
        });
      } else {
        acrossDonateTransaction.mutate({
          userAmountInWei,
          application,
          wallet,
          chainId: options.chainId,
        });
      }
    },
    [acrossDonateTransaction, donateTransaction, switchChain, wallet],
  );

  const isDonating =
    switchChain.isPending ||
    donateTransaction.isPending ||
    acrossDonateTransaction.isPending;

  const isError =
    switchChain.isError ||
    donateTransaction.isError ||
    acrossDonateTransaction.isError;

  const isSuccess =
    donateTransaction.isSuccess || acrossDonateTransaction.isSuccess;

  const isIdle = !isDonating && !isError && !isSuccess;

  const data = donateTransaction.data ?? acrossDonateTransaction.data;

  return {
    donate,
    isDonating,
    isError,
    isSuccess,
    data,
    isIdle,
  };
};
