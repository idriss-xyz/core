import { useMutation } from '@tanstack/react-query';

import { createContract, createEthersProvider } from 'shared/web3';

import {
  ALLO_CONTRACT_ABI,
  ALLO_CONTRACT_ADDRESS,
} from '../../donation.constants';
import { generateVote } from '../../donation.library';

import { UseDonateTransactionProperties } from './use-donate-transaction.types';

export const useDonateTransaction = () => {
  return useMutation({
    mutationFn: async ({
      wallet,
      application,
      userAmountInWei,
    }: UseDonateTransactionProperties) => {
      const ethersProvider = createEthersProvider(wallet.provider);
      const signer = ethersProvider.getSigner(wallet.account);

      const alloContract = createContract({
        address: ALLO_CONTRACT_ADDRESS,
        abi: ALLO_CONTRACT_ABI,
        signer,
      });

      const vote = generateVote(
        application.project.anchorAddress,
        userAmountInWei,
      );

      const populatedTransaction =
        await alloContract.populateTransaction.allocate?.(
          Number(application.roundId),
          vote,
        );

      const result = await signer.sendTransaction({
        ...populatedTransaction,
        from: wallet.account,
        value: userAmountInWei,
        to: ALLO_CONTRACT_ADDRESS,
      });

      const { transactionHash } = await result.wait();
      return { transactionHash };
    },
  });
};
