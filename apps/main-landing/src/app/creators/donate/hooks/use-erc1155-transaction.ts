import { useMutation } from '@tanstack/react-query';
import {
  Hex,
  WalletClient,
  encodeFunctionData,
  decodeFunctionResult,
  erc1155Abi,
} from 'viem';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import { EMPTY_HEX, TIPPING_ABI } from '@idriss-xyz/constants';
import { getChainById } from '@idriss-xyz/utils';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '../constants';

interface Properties {
  chainId: number;
  message: string;
  contractAddress: Hex;
  tokenId: bigint;
  amount: bigint;
  recipientAddress: Hex;
  walletClient: WalletClient;
  callbackOnSend?: (txHash: string) => void;
}

export const useErc1155Transaction = () => {
  return useMutation({
    mutationFn: async ({
      chainId,
      message,
      contractAddress,
      tokenId,
      amount,
      walletClient,
      recipientAddress,
      callbackOnSend,
    }: Properties) => {
      const [account] = await walletClient.getAddresses();
      if (!account) throw new Error('no account connected');

      const chain = getChainById(chainId);
      const idrissTippingAddress =
        CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? EMPTY_HEX;

      const isApprovedData = encodeFunctionData({
        abi: erc1155Abi,
        functionName: 'isApprovedForAll',
        args: [account, idrissTippingAddress],
      });

      const isApprovedRaw = await call(walletClient, {
        account,
        to: contractAddress,
        data: isApprovedData,
      });
      if (isApprovedRaw.data === undefined)
        throw new Error('approval check failed');

      const isApprovedForAll = decodeFunctionResult({
        abi: erc1155Abi,
        functionName: 'isApprovedForAll',
        data: isApprovedRaw.data,
      });

      if (!isApprovedForAll) {
        const approveAllData = encodeFunctionData({
          abi: erc1155Abi,
          functionName: 'setApprovalForAll',
          args: [idrissTippingAddress, true],
        });

        const approveGas = await estimateGas(walletClient, {
          account,
          to: contractAddress,
          data: approveAllData,
        });

        const approveTx = await walletClient.sendTransaction({
          account,
          to: contractAddress,
          data: approveAllData,
          gas: approveGas,
          chain,
        });

        const approveRcpt = await waitForTransactionReceipt(walletClient, {
          hash: approveTx,
        });
        if (approveRcpt.status === 'reverted')
          throw new Error('approve reverted');
      }

      const sendData = encodeFunctionData({
        abi: TIPPING_ABI,
        functionName: 'sendERC1155To',
        args: [recipientAddress, tokenId, amount, contractAddress, message],
      });

      const gas = await estimateGas(walletClient, {
        account,
        to: idrissTippingAddress,
        data: sendData,
      });

      const txHash = await walletClient.sendTransaction({
        account,
        to: idrissTippingAddress,
        data: sendData,
        gas,
        chain,
      });

      callbackOnSend?.(txHash);

      const receipt = await waitForTransactionReceipt(walletClient, {
        hash: txHash,
      });
      if (receipt.status === 'reverted') throw new Error('reverted');

      return { transactionHash: txHash };
    },
  });
};
