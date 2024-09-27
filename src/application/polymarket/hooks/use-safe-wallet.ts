import { useQuery } from '@tanstack/react-query';
import { parseAbi } from 'viem';

import { CHAIN, Wallet, createWalletClient, useWallet } from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { GetFunderAddresCommand } from '../commands';
import { ERC_20_ABI, SAFE_USDC_ADDRES } from '../constants';
import { SafeWallet } from '../types';

export const getSafeWalletQueryKey = (wallet?: Wallet) => {
  return ['getSafeWallet', wallet?.account, wallet?.chainId];
};

// TODO: we can skip calling safe API by replacing it with logic that deterministically gets safe wallet
export const useSafeWallet = () => {
  const { wallet } = useWallet();
  const funderAddressMutation = useCommandMutation(GetFunderAddresCommand);

  return useQuery({
    queryKey: getSafeWalletQueryKey(wallet),
    enabled: !!wallet && wallet.chainId === CHAIN.POLYGON.id,
    queryFn: async () => {
      if (!wallet || wallet.chainId !== CHAIN.POLYGON.id) {
        return;
      }

      const address = await funderAddressMutation.mutateAsync({
        address: wallet.account,
      });
      if (!address) {
        throw new Error('Account not found');
      }

      const walletClient = createWalletClient(wallet);

      const balance = await walletClient.readContract({
        abi: parseAbi(ERC_20_ABI),
        address: SAFE_USDC_ADDRES,
        functionName: 'balanceOf',
        args: [address],
      });

      const result: SafeWallet = {
        address,
        balance: Number((Number(balance) / 1_000_000).toFixed(2)),
      };

      return result;
    },
  });
};
