import { useMutation } from '@tanstack/react-query';

import {
  GetAcrossChainFeeCommand,
  Wallet,
  createContract,
  createSigner,
} from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import {
  generateDonationData,
  generateEIP712Signature,
  generateVote,
} from '../utils';
import {
  DONATION_CONTRACT_ABI,
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
  WRAPPED_ETH_ADDRESS_PER_CHAIN_ID,
} from '../constants';
import { Application } from '../types';

interface Properties {
  wallet: Wallet;
  application: Application;
  userAmountInWei: number;
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

      console.log('GENERATING VOTE with', signer);

      const vote = generateVote(
        application.project.anchorAddress,
        userAmountInWei,
      );
      console.log('VOTE IS', vote);

      const data = await generateDonationData(
        Number(application.roundId),
        chainId,
        DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[chainId] ?? '',
        wallet.account,
        vote,
      );
      console.log('DATA IS', data);

      const encodedDataWithSignature = await generateEIP712Signature(
        signer,
        data,
      );
      console.log('ENCODED MSG is', encodedDataWithSignature);

      const contractOrigin = createContract({
        address: DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[chainId] ?? '',
        abi: DONATION_CONTRACT_ABI,
        signerOrProvider: signer,
      });
      console.log('CONTRACT IS', contractOrigin);

      const feeResponse = await checkAcrossChainFee.mutateAsync({
        amount: userAmountInWei.toString(),
        message: encodedDataWithSignature,
        recipient:
          DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
        chain: {
          id: chainId,
          wrappedEthAddress: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[chainId] ?? '',
        },
        destinationChainId: application.chainId,
      });

      console.log('FEE IS', feeResponse);

      const fee = Math.floor(Number(feeResponse.totalRelayFee.total) * 1.01);

      const inputAmount = userAmountInWei + fee;

      const depositParameters = {
        recipient:
          DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
        inputAmount: inputAmount,
        outputAmount: userAmountInWei,
        inputToken: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[chainId] ?? '',
        outputToken: '0x0000000000000000000000000000000000000000',
        destinationChainId: application.chainId,
        exclusiveRelayer: '0x0000000000000000000000000000000000000000',
        quoteTimestamp: feeResponse.timestamp,
        fillDeadline: Math.round(Date.now() / 1000) + 21_600,
        exclusivityDeadline: 0,
      };

      const preparedTx =
        await contractOrigin.populateTransaction.callDepositV3?.(
          depositParameters,
          encodedDataWithSignature,
        );

      const sendOptions = {
        from: wallet.account,
        value: inputAmount,
      };

      const result = await signer.sendTransaction({
        ...preparedTx,
        ...sendOptions,
        to: contractOrigin.address,
      });

      const { transactionHash } = await result.wait();
      return { transactionHash };
    },
  });
};
