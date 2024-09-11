import { useMutation } from '@tanstack/react-query';

import { createWalletClient } from './utils';
import { CHAIN } from './constants';
import { Wallet } from './types';

interface SwitchChainArguments {
  wallet?: Wallet;
  chainId: number;
}

export const useSwitchChain = () => {
  return useMutation({
    mutationFn: async ({ chainId, wallet }: SwitchChainArguments) => {
      if (!wallet) {
        return;
      }

      const client = createWalletClient(wallet);
      const currentChainId = await client.getChainId();
      if (chainId === currentChainId) {
        return;
      }

      const foundChain = Object.values(CHAIN).find((chain) => {
        return chain.id === chainId;
      });

      if (!foundChain) {
        throw new Error('Chain is not configured');
      }

      await client.switchChain({ id: chainId });
      // TODO: double check if chain is not configured
    },
  });
};
