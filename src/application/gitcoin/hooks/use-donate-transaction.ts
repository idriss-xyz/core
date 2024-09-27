import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData } from 'viem';

import {
  createWalletClient,
  getChainById,
  TransactionRevertedError,
  Wallet,
} from 'shared/web3';
import { useObservabilityScope } from 'shared/observability';

import { Application } from '../types';
import { generateVote } from '../utils';
import { ALLO_CONTRACT_ABI, ALLO_CONTRACT_ADDRESS } from '../constants';

interface Properties {
  wallet: Wallet;
  application: Application;
  userAmountInWei: string;
  chainId: number;
}

export const useDonateTransaction = () => {
  const observabilityScope = useObservabilityScope();

  return useMutation({
    mutationFn: async ({
      wallet,
      application,
      userAmountInWei,
      chainId,
    }: Properties) => {
      const walletClient = createWalletClient(wallet);

      const vote = generateVote(
        application.project.anchorAddress,
        BigInt(userAmountInWei),
      );

      const encodedData = encodeFunctionData({
        abi: ALLO_CONTRACT_ABI,
        functionName: 'allocate',
        args: [BigInt(application.roundId), vote],
      });

      const transactionHash = await walletClient.sendTransaction({
        data: encodedData,
        from: wallet.account,
        value: BigInt(userAmountInWei),
        to: ALLO_CONTRACT_ADDRESS,
        chain: getChainById(chainId),
      });

      const receipt = await walletClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      if (receipt.status === 'reverted') {
        const error = new TransactionRevertedError({ transactionHash });
        observabilityScope.captureException(error);
        throw error;
      }

      return { transactionHash };
    },
  });
};
