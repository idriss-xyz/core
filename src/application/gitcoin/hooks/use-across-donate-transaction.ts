import { useMutation } from '@tanstack/react-query';
import {
  encodeAbiParameters,
  encodeFunctionData,
  parseAbiParameters,
} from 'viem';

import {
  createWalletClient,
  EMPTY_HEX,
  GetAcrossChainFeeCommand,
  getChainById,
  Hex,
  Wallet,
} from 'shared/web3';
import { useCommandMutation } from 'shared/messaging';

import { generateVote, getDonationContractAddress } from '../utils';
import {
  ACROSS_DONATION_MODIFIER,
  DONATION_CONTRACT_ABI,
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
      const walletClient = createWalletClient(wallet);

      const vote = generateVote(
        application.project.anchorAddress,
        BigInt(userAmountInWei),
      );

      const getNonceCommand = new GetNonceCommand({
        destinationChainId: application.chainId,
        senderAddress: wallet.account,
      });

      const nonce = BigInt(await getNonceCommand.send());

      const signatureData = {
        chainId: application.chainId,
        roundId: BigInt(application.roundId),
        donor: wallet.account,
        voteParams: vote,
        nonce: nonce,
        validUntil: Math.round(Date.now() / 1000) + 3600, // 1 hour
        verifyingContract: getDonationContractAddress(application.chainId),
      } as const;

      const domain = {
        name: 'IDrissCrossChainDonations',
        version: '1',
      };
      const types = {
        Donation: [
          { name: 'chainId', type: 'uint256' },
          { name: 'roundId', type: 'uint256' },
          { name: 'donor', type: 'address' },
          { name: 'voteParams', type: 'bytes' },
          { name: 'nonce', type: 'uint256' },
          { name: 'validUntil', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
      };
      const signature = await walletClient.signTypedData({
        domain,
        types,
        message: signatureData,
        primaryType: 'Donation',
      });
      const encodedDataWithSignature = encodeAbiParameters(
        parseAbiParameters([
          'uint256',
          'uint256',
          'address',
          'bytes',
          'uint256',
          'uint256',
          'address',
          'bytes',
        ]),
        [
          BigInt(signatureData.chainId),
          signatureData.roundId,
          signatureData.donor,
          signatureData.voteParams,
          signatureData.nonce,
          BigInt(signatureData.validUntil),
          signatureData.verifyingContract,
          signature,
        ],
      );

      const feeResponse = await checkAcrossChainFee.mutateAsync({
        amount: userAmountInWei,
        message: encodedDataWithSignature,
        recipient: getDonationContractAddress(application.chainId),
        chain: {
          id: chainId,
          wrappedEthAddress:
            WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[chainId] ?? EMPTY_HEX,
        },
        destinationChainId: application.chainId,
      });

      const fee =
        (BigInt(feeResponse.totalRelayFee.total) * BigInt(101)) / BigInt(100);

      const inputAmount = BigInt(userAmountInWei) + fee;

      const donationContractAddress = getDonationContractAddress(
        application.chainId,
      );

      const depositParameters = {
        recipient: donationContractAddress,
        inputToken: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[chainId] ?? EMPTY_HEX,
        outputToken: '0x0000000000000000000000000000000000000000',
        inputAmount: inputAmount,
        outputAmount: BigInt(userAmountInWei),
        destinationChainId: BigInt(application.chainId),
        exclusiveRelayer: '0x0000000000000000000000000000000000000000',
        quoteTimestamp: Number(feeResponse.timestamp),
        fillDeadline: Math.round(Date.now() / 1000) + 21_600,
        exclusivityDeadline: 0,
      } as const;

      const depositV3Data = encodeFunctionData({
        abi: DONATION_CONTRACT_ABI,
        functionName: 'callDepositV3',
        args: [depositParameters, encodedDataWithSignature],
      });

      const modifiedData = (depositV3Data + ACROSS_DONATION_MODIFIER) as Hex;

      const transactionHash = await walletClient.sendTransaction({
        chain: getChainById(chainId),
        data: modifiedData,
        to: getDonationContractAddress(chainId),
        gas: BigInt(600_000),
        value: inputAmount,
      });

      await walletClient.waitForTransactionReceipt({ hash: transactionHash });

      return { transactionHash };
    },
  });
};
