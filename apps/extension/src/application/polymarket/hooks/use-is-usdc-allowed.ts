import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@idriss-xyz/wallet-connect';
import { parseAbi } from 'viem';

import { CHAIN, createWalletClient } from 'shared/web3';

import {
  POLYMARKET_CONDITIONAL_TOKENS_CONTRACT_ADDRESS,
  ERC_20_ABI,
  SAFE_USDC_ADDRES,
} from '../constants';

import { useSafeWallet } from './use-safe-wallet';

export const useIsUsdcAllowed = () => {
  const { wallet } = useWallet();
  const safeWalletQuery = useSafeWallet();

  const safeWalletAddress = safeWalletQuery.data?.address;

  return useQuery({
    queryKey: [
      'isUsdcAllowed',
      wallet?.chainId,
      wallet?.account,
      safeWalletAddress,
    ],
    enabled:
      !!wallet &&
      wallet.chainId === CHAIN.POLYGON.id &&
      safeWalletQuery.isSuccess,
    queryFn: async () => {
      if (
        !wallet ||
        wallet.chainId !== CHAIN.POLYGON.id ||
        !safeWalletAddress
      ) {
        return;
      }
      const walletClient = createWalletClient(wallet);

      const allowance = await walletClient.readContract({
        abi: parseAbi(ERC_20_ABI),
        address: SAFE_USDC_ADDRES,
        functionName: 'allowance',
        args: [
          safeWalletAddress,
          POLYMARKET_CONDITIONAL_TOKENS_CONTRACT_ADDRESS,
        ],
      });

      return allowance > BigInt(0);
    },
  });
};
