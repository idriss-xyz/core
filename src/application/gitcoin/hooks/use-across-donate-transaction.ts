import { useMutation } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import {
  EMPTY_HEX,
  GetAcrossChainFeeCommand,
  Wallet,
  createContract,
  createSigner,
} from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import {
  generateDonationDataV2,
  generateEIP712Signature,
  generateVote,
} from '../utils';
import {
  ACROSS_DONATION_MODIFIER,
  DONATION_CONTRACT_ABI,
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
  WRAPPED_ETH_ADDRESS_PER_CHAIN_ID,
} from '../constants';
import { Application } from '../types';
import { GetNonceCommand } from '../commands';

interface Properties {
  wallet: Wallet;
  application: Application;
  userAmountInWei: string;
  chainId: number;
}

export const useAcrossDonateTransaction = () => {
  const checkAcrossChainFee = useCommandMutation(GetAcrossChainFeeCommand);

  return useMutation({
    mutationFn: async ({
      wallet,
      application,
      userAmountInWei,
      chainId,
    }: Properties) => {
      //  ToDo: check where/when chain switch is happening
      const signer = createSigner(wallet);

      const vote = generateVote(
        application.project.anchorAddress,
        BigNumber.from(userAmountInWei),
      );

      const getNonceCommand = new GetNonceCommand({
        destinationChainId: application.chainId,
        senderAddress: wallet.account,
      });

      const nonce = await getNonceCommand.send();

      const data = generateDonationDataV2(
        Number(application.roundId),
        application.chainId,
        DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ??
          EMPTY_HEX,
        wallet.account,
        vote,
        nonce,
      );

      const encodedDataWithSignature = await generateEIP712Signature(
        signer,
        data,
      );

      const contractOrigin = createContract({
        address:
          DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[chainId]?.toLowerCase() ?? '',
        abi: DONATION_CONTRACT_ABI,
        signerOrProvider: signer,
      });

      const feeResponse = await checkAcrossChainFee.mutateAsync({
        amount: userAmountInWei,
        message: encodedDataWithSignature,
        recipient:
          DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
        chain: {
          id: chainId,
          wrappedEthAddress: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[chainId] ?? '',
        },
        destinationChainId: application.chainId,
      });

      const fee = BigNumber.from(feeResponse.totalRelayFee.total)
        .mul(101)
        .div(100);

      const inputAmount = BigNumber.from(userAmountInWei).add(fee);

      const depositParameters = {
        recipient:
          DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
        inputToken: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[chainId] ?? '',
        outputToken: '0x0000000000000000000000000000000000000000',
        inputAmount: inputAmount,
        outputAmount: BigNumber.from(userAmountInWei),
        destinationChainId: application.chainId,
        exclusiveRelayer: '0x0000000000000000000000000000000000000000',
        quoteTimestamp: Number(feeResponse.timestamp),
        fillDeadline: Math.round(Date.now() / 1000) + 21_600,
        exclusivityDeadline: 0,
      };

      const preparedTx =
        await contractOrigin.populateTransaction.callDepositV3?.(
          depositParameters,
          encodedDataWithSignature,
        );

      if (!preparedTx) {
        throw new Error('Expected preparedTx');
      }

      const modifiedData = preparedTx.data + ACROSS_DONATION_MODIFIER;

      const sendOptions = {
        from: wallet.account,
        value: inputAmount,
      };

      const result = await signer.sendTransaction({
        ...preparedTx,
        data: modifiedData,
        ...sendOptions,
        to: contractOrigin.address,
        gasLimit: 500_000,
      });

      const { transactionHash } = await result.wait();
      return { transactionHash };
    },
  });
};
