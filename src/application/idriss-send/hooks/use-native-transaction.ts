import { useMutation } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { Hex, Wallet, createContract, createSigner } from 'shared/web3';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS, TIPPING_ABI } from '../constants';

interface Properties {
  recipientAddress: Hex;
  tokensToSend: BigNumber;
  wallet: Wallet;
  chainId: number;
}

export const useNativeTransaction = () => {
  return useMutation({
    mutationFn: async ({
      recipientAddress,
      tokensToSend,
      wallet,
      chainId,
    }: Properties) => {
      const signer = createSigner(wallet);

      const tippingContract = createContract({
        abi: TIPPING_ABI,
        address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? '',
        signerOrProvider: signer,
      });

      const gas = await tippingContract.estimateGas.sendTo?.(
        recipientAddress,
        tokensToSend,
        '',
        {
          value: tokensToSend.toString(),
          from: wallet.account,
        },
      );

      const populatedTransaction =
        await tippingContract.populateTransaction.sendTo?.(
          recipientAddress,
          tokensToSend,
          '',
        );

      const result = await signer.sendTransaction({
        ...populatedTransaction,
        gasLimit: gas,
        value: tokensToSend,
      });

      const { transactionHash } = await result.wait();

      return { transactionHash };
    },
  });
};
