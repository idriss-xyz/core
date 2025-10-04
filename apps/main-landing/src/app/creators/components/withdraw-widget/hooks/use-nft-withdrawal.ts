import { useCallback, useState } from 'react';
import { getChainById } from '@idriss-xyz/utils';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import {
  encodeFunctionData,
  Hex,
  erc721Abi,
  erc1155Abi,
  createPublicClient,
  http,
} from 'viem';
import { DUMMY_RECIPIENT } from '@idriss-xyz/constants';

import { claimDailyDrip } from '../utils';

type UseNftWithdrawalProperties = {
  onSuccess?: (txHash: Hex) => void;
  onError?: (error: string) => void;
};

type CheckGasAndProceedNftArguments = {
  chainId: number;
  assetAddress: Hex;
  nftType: 'erc721' | 'erc1155';
  tokenId: bigint;
  amount1155?: bigint; // defaults to 1 if omitted
};

type SendNftWithdrawalArguments = {
  withdrawalAddress: Hex;
  chainId: number;
  assetAddress: Hex;
  nftType: 'erc721' | 'erc1155';
  tokenId: bigint;
  amount1155?: bigint; // defaults to 1 if omitted
};

// ts-unused-exports:disable-next-line
export const useNftWithdrawal = ({
  onSuccess,
  onError,
}: UseNftWithdrawalProperties = {}) => {
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<Hex>();

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setTransactionHash(undefined);
  }, []);

  const checkGasAndProceedNft = useCallback(
    async ({
      chainId,
      assetAddress,
      nftType,
      tokenId,
      amount1155,
    }: CheckGasAndProceedNftArguments) => {
      setError(null);
      const dripTxHash = await claimDailyDrip(
        chainId,
        assetAddress,
        nftType,
        tokenId,
      );
      if (dripTxHash) {
        try {
          const client = createPublicClient({
            chain: getChainById(chainId),
            transport: http(),
          });
          await client.waitForTransactionReceipt({ hash: dripTxHash });
        } catch {
          /* ignore – fallback to normal flow */
        }
      }

      const activeWallet = wallets.find((w) => {
        return w.walletClientType === 'privy';
      });
      if (!activeWallet) {
        setError('Wallet not connected.');
        return false;
      }

      try {
        await activeWallet.switchChain(chainId);
        const provider = await activeWallet.getEthereumProvider();

        const calldata =
          nftType === 'erc721'
            ? encodeFunctionData({
                abi: erc721Abi,
                functionName: 'safeTransferFrom',
                args: [activeWallet.address as Hex, DUMMY_RECIPIENT, tokenId],
              })
            : encodeFunctionData({
                abi: erc1155Abi,
                functionName: 'safeTransferFrom',
                args: [
                  activeWallet.address as Hex,
                  DUMMY_RECIPIENT,
                  tokenId,
                  amount1155 ?? 1n,
                  '0x',
                ],
              });

        const [gas, gasPrice, nativeBalanceHex] = await Promise.all([
          provider.request({
            method: 'eth_estimateGas',
            params: [
              {
                from: activeWallet.address,
                to: assetAddress,
                data: calldata,
                value: '0x0',
              },
            ],
          }),
          provider.request({ method: 'eth_gasPrice', params: [] }),
          provider.request({
            method: 'eth_getBalance',
            params: [activeWallet.address, 'latest'],
          }),
        ]);

        const gasCost = BigInt(gas) * BigInt(gasPrice);
        const nativeBalance = BigInt(nativeBalanceHex);

        if (nativeBalance < gasCost) {
          const chain = getChainById(chainId);
          const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
          setError(
            `Not enough ${nativeCurrencySymbol} in your wallet to cover network fees.`,
          );
          return false;
        }

        return true;
      } catch {
        setError('Something went wrong. Try again in a few seconds.');
        return false;
      }
    },
    [wallets],
  );

  const sendNftWithdrawal = useCallback(
    async ({
      withdrawalAddress,
      chainId,
      assetAddress,
      nftType,
      tokenId,
      amount1155,
    }: SendNftWithdrawalArguments) => {
      setError(null);
      setIsLoading(true);

      const activeWallet = wallets.find((w) => {
        return w.walletClientType === 'privy';
      });
      if (!activeWallet) {
        setIsLoading(false);
        setError('Wallet not connected.');
        return;
      }

      try {
        await activeWallet.switchChain(chainId);

        const data =
          nftType === 'erc721'
            ? encodeFunctionData({
                abi: erc721Abi,
                functionName: 'safeTransferFrom',
                args: [activeWallet.address as Hex, withdrawalAddress, tokenId],
              })
            : encodeFunctionData({
                abi: erc1155Abi,
                functionName: 'safeTransferFrom',
                args: [
                  activeWallet.address as Hex,
                  withdrawalAddress,
                  tokenId,
                  amount1155 ?? 1n,
                  '0x',
                ],
              });

        const tx = await sendTransaction(
          { to: assetAddress, value: '0', data, chainId },
          { uiOptions: { showWalletUIs: false } },
        );

        setTransactionHash(tx.hash);
        setIsLoading(false);
        setIsSuccess(true);
        onSuccess?.(tx.hash);
      } catch (error_) {
        let errorMessage = 'Something went wrong. Try again in a few seconds.';
        if (
          error_ instanceof Error &&
          (error_.message.toLowerCase().includes('insufficient funds') ||
            error_.message
              .toLowerCase()
              .includes('gas required exceeds allowance'))
        ) {
          const chain = getChainById(chainId);
          const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
          errorMessage = `Not enough ${nativeCurrencySymbol} in your wallet for network fees.`;
        }
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
        setIsSuccess(false);
      }
    },
    [sendTransaction, wallets, onSuccess, onError],
  );

  return {
    checkGasAndProceedNft,
    sendNftWithdrawal,
    isLoading,
    isSuccess,
    error,
    transactionHash,
    reset,
  };
};
