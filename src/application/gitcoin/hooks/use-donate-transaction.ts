import { useMutation } from '@tanstack/react-query';

import { Wallet, createContract, createSigner } from 'shared/web3';

import { ALLO_CONTRACT_ABI, ALLO_CONTRACT_ADDRESS } from '../constants';
import { generateVote } from '../utils';
import { Application } from '../types';

interface Properties {
  wallet: Wallet;
  application: Application;
  userAmountInWei: number;
}

export const useDonateTransaction = () => {
  return useMutation({
    mutationFn: async ({
      wallet,
      application,
      userAmountInWei,
    }: Properties) => {
      const signer = createSigner(wallet);

      const alloContract = createContract({
        address: ALLO_CONTRACT_ADDRESS,
        abi: ALLO_CONTRACT_ABI,
        signerOrProvider: signer,
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
