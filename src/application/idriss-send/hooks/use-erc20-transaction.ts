import { useMutation } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { Hex, Wallet, createContract, createSigner } from 'shared/web3';

import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  ERC20_ABI,
  TIPPING_ABI,
} from '../constants';

interface Properties {
  tokenAddress: Hex;
  chainId: number;
  wallet: Wallet;
  tokensToSend: BigNumber;
  recipientAddress: Hex;
}

export const useErc20Transaction = () => {
  return useMutation({
    mutationFn: async ({
      tokenAddress,
      wallet,
      chainId,
      tokensToSend,
      recipientAddress,
    }: Properties) => {
      const signer = createSigner(wallet);

      const tippingContract = createContract({
        abi: TIPPING_ABI,
        address: CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? '',
        signerOrProvider: signer,
      });

      const erc20Contract = createContract({
        abi: ERC20_ABI,
        address: tokenAddress,
        signerOrProvider: signer,
      });

      const [allowance] = (await erc20Contract.functions.allowance?.(
        wallet.account,
        CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? '',
      )) as [BigNumber];

      if (allowance.lt(tokensToSend)) {
        const gas = await erc20Contract.estimateGas.approve?.(
          CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? '',
          tokensToSend,
          {
            value: 0,
            from: wallet.account,
          },
        );

        const populatedTransaction =
          await erc20Contract.populateTransaction.approve?.(
            CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? '',
            tokensToSend,
          );

        const result = await signer.sendTransaction({
          ...populatedTransaction,
          value: 0,
          gasLimit: gas,
        });

        await result.wait();
      }
      const gas = await tippingContract.estimateGas.sendTokenTo?.(
        recipientAddress,
        tokensToSend,
        tokenAddress,
        '',
        {
          value: 0,
          from: wallet.account,
        },
      );

      const populatedTransaction =
        await tippingContract.populateTransaction.sendTokenTo?.(
          recipientAddress,
          tokensToSend,
          tokenAddress,
          '',
        );

      const result = await signer.sendTransaction({
        ...populatedTransaction,
        value: 0,
        gasLimit: gas,
      });

      const { transactionHash } = await result.wait();

      return { transactionHash };
    },
  });
};
