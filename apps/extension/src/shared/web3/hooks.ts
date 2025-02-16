import { useMutation } from '@tanstack/react-query';
import { getChainById, isUnrecognizedChainError } from '@idriss-xyz/constants';
import { Wallet } from '@idriss-xyz/wallet-connect';

import { createWalletClient } from './utils';

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

      const foundChain = getChainById(chainId);

      if (!foundChain) {
        throw new Error('Chain is not configured');
      }

      try {
        await client.switchChain({ id: chainId });
      } catch (error) {
        if (isUnrecognizedChainError(error)) {
          await client.addChain({ chain: foundChain });
          return;
        }

        throw error;
      }
    },
  });
};
