import { getChainById, isUnrecognizedChainError } from '@idriss-xyz/utils';
import { useMutation } from '@tanstack/react-query';
import { WalletClient } from 'viem';

interface SwitchChainArguments {
  chainId: number;
  walletClient?: WalletClient;
}

export const useSwitchChain = () => {
  return useMutation({
    mutationFn: async ({ chainId, walletClient }: SwitchChainArguments) => {
      if (!walletClient) {
        return;
      }

      const currentChainId = await walletClient.getChainId();

      if (chainId === currentChainId) {
        return;
      }

      const foundChain = getChainById(chainId);

      if (!foundChain) {
        throw new Error('Chain is not configured');
      }

      try {
        await walletClient.switchChain({ id: chainId });
      } catch (error) {
        if (isUnrecognizedChainError(error)) {
          await walletClient.addChain({ chain: foundChain });
          return;
        }

        throw error;
      }
    },
  });
};
