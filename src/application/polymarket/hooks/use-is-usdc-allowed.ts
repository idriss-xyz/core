import { useQuery } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';

import { CHAIN, createEthersProvider, useWallet } from 'shared/web3';

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
      const ethersProvider = createEthersProvider(wallet.provider);

      const usdcContract = new ethers.Contract(
        SAFE_USDC_ADDRES,
        ERC_20_ABI,
        ethersProvider,
      );

      const allowance: BigNumber =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await usdcContract.allowance(
          safeWalletAddress,
          POLYMARKET_CONDITIONAL_TOKENS_CONTRACT_ADDRESS,
        );

      return allowance.gt(BigNumber.from(0));
    },
  });
};
