import { useMutation } from '@tanstack/react-query';
import {
  Hex,
  WalletClient,
  encodeFunctionData,
  decodeFunctionResult,
  erc721Abi,
} from 'viem';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import {
  EMPTY_HEX,
  TIPPING_ABI,
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  BASE_SUFFIX,
} from '@idriss-xyz/constants';
import { getChainById } from '@idriss-xyz/utils';

interface Properties {
  chainId: number;
  message: string;
  collectionAddress: Hex;
  tokenId: bigint;
  recipientAddress: Hex;
  walletClient: WalletClient;
  callbackOnSend?: (txHash: string) => void;
}

export const useErc721Transaction = () => {
  return useMutation({
    mutationFn: async ({
      chainId,
      message,
      collectionAddress,
      tokenId,
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
        abi: erc721Abi,
        functionName: 'isApprovedForAll',
        args: [account, idrissTippingAddress],
      });

      const isApprovedRaw = await call(walletClient, {
        account,
        to: collectionAddress,
        data: isApprovedData,
      });
      if (isApprovedRaw.data === undefined)
        throw new Error('approval check failed');

      const isApprovedForAll = decodeFunctionResult({
        abi: erc721Abi,
        functionName: 'isApprovedForAll',
        data: isApprovedRaw.data,
      });

      if (!isApprovedForAll) {
        const approveAllData = (encodeFunctionData({
          abi: erc721Abi,
          functionName: 'setApprovalForAll',
          args: [idrissTippingAddress, true],
        }) + BASE_SUFFIX.slice(2)) as Hex;

        const approveGas = await estimateGas(walletClient, {
          account,
          to: collectionAddress,
          data: approveAllData,
        });

        const approveTx = await walletClient.sendTransaction({
          account,
          to: collectionAddress,
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

      const sendNftData = (encodeFunctionData({
        abi: TIPPING_ABI,
        functionName: 'sendERC721To',
        args: [recipientAddress, tokenId, collectionAddress, message],
      }) + BASE_SUFFIX.slice(2)) as Hex;

      const gas = await estimateGas(walletClient, {
        account,
        to: idrissTippingAddress,
        data: sendNftData,
      });

      const txHash = await walletClient.sendTransaction({
        account,
        to: idrissTippingAddress,
        data: sendNftData,
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
