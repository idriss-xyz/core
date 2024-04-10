import { useMutation } from '@tanstack/react-query';
import { EIP1193Provider } from 'mipd';

import { hexStringToNumber, numberToHexString } from './web3.utils';
import { CHAIN } from './web3.constants';

interface SwitchChainArguments {
  walletProvider: EIP1193Provider | null;
  chainId: number;
}

export const useSwitchChain = () => {
  return useMutation({
    mutationFn: async ({ chainId, walletProvider }: SwitchChainArguments) => {
      if (!walletProvider || !walletProvider.request) {
        return;
      }
      const currentChainId = await walletProvider.request({
        method: 'eth_chainId',
      });

      if (hexStringToNumber(currentChainId) !== chainId) {
        const foundChain = Object.values(CHAIN).find((chain) => {
          return chain.id === chainId;
        });

        if (!foundChain) {
          throw new Error('Chain is not configured');
        }

        try {
          await walletProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: numberToHexString(chainId) }],
          });
        } catch (error) {
          if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 4902
          ) {
            await walletProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: numberToHexString(chainId),
                  chainName: foundChain.name,
                  nativeCurrency: foundChain.nativeCurrency,
                  rpcUrls: foundChain.rpcUrls,
                  blockExplorerUrls: foundChain.blockExplorerUrls,
                },
              ],
            });
          } else {
            throw error;
          }
        }
      }
    },
  });
};
