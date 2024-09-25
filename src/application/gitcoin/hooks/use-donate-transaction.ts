import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData } from 'viem';

import { createWalletClient, getChainById, Wallet } from 'shared/web3';

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

      await walletClient.waitForTransactionReceipt({
        hash: transactionHash,
      });
      return { transactionHash };
    },
  });
};
