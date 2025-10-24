import { useCallback, useState } from 'react';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import {
  createPublicClient,
  encodeFunctionData,
  formatUnits,
  Hex,
  http,
} from 'viem';
import {
  ERC20_ABI,
  NULL_ADDRESS,
  DUMMY_RECIPIENT,
  TokenBalance,
} from '@idriss-xyz/constants';
import { calculateTokensToSend, getChainById } from '@idriss-xyz/utils';

import { claimDailyDrip } from '../utils';

type UseWithdrawalProperties = {
  onSuccess?: (txHash: Hex) => void;
  onError?: (error: string) => void;
};

type CheckGasAndProceedArguments = {
  chainId: number;
  isMaxAmount: boolean;
  selectedBalance: TokenBalance;
  requestedUsdAmount: number;
  tokenAddress: Hex | undefined;
};

type SendWithdrawalArguments = {
  withdrawalAddress: Hex;
  chainId: number;
  isMaxAmount: boolean;
  selectedBalance: TokenBalance;
  requestedUsdAmount: number;
  tokenAddress: Hex | undefined;
};

export const useWithdrawal = ({
  onSuccess,
  onError,
}: UseWithdrawalProperties = {}) => {
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<Hex>();
  const [amountInTokens, setAmountInTokens] = useState<bigint>();
  const [adjustedAmount, setAdjustedAmount] = useState<number>();

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsSuccess(false);
    setError(null);
    setTransactionHash(undefined);
    setAmountInTokens(undefined);
    setAdjustedAmount(undefined);
  }, []);

  const checkGasAndProceed = useCallback(
    async ({
      chainId,
      isMaxAmount,
      selectedBalance,
      requestedUsdAmount,
      tokenAddress,
    }: CheckGasAndProceedArguments) => {
      setError(null);
      const dripTxHash = await claimDailyDrip(chainId, tokenAddress);
      if (dripTxHash) {
        try {
          const client = createPublicClient({
            chain: getChainById(chainId),
            transport: http(),
          });
          await client.waitForTransactionReceipt({ hash: dripTxHash });
        } catch {
          /* ignore */
        }
      }
      setAdjustedAmount(undefined);

      const activeWallet = wallets.find((wallet) => {
        return wallet.walletClientType === 'privy';
      });
      if (!activeWallet) {
        setError('Wallet not connected.');
        return false;
      }

      if (!selectedBalance || selectedBalance.usdValue <= 0) {
        return false;
      }

      const tokensToSend = calculateTokensToSend({
        isMaxAmount,
        balance: selectedBalance,
        requestedUsdAmount,
      });

      if (tokensToSend === null) {
        return false;
      }
      const isNative = tokenAddress === NULL_ADDRESS;

      const txForEstimation = isNative
        ? {
            from: activeWallet.address,
            to: DUMMY_RECIPIENT,
            value: tokensToSend,
          }
        : {
            from: activeWallet.address,
            to: tokenAddress,
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'transfer',
              args: [DUMMY_RECIPIENT, tokensToSend],
            }),
          };

      try {
        await activeWallet.switchChain(chainId);
        const provider = await activeWallet.getEthereumProvider();
        const [gas, gasPrice, nativeBalanceHex] = await Promise.all([
          provider.request({
            method: 'eth_estimateGas',
            params: [txForEstimation],
          }),
          provider.request({ method: 'eth_gasPrice', params: [] }),
          provider.request({
            method: 'eth_getBalance',
            params: [activeWallet.address, 'latest'],
          }),
        ]);

        const gasCost = BigInt(gas) * BigInt(gasPrice);
        const nativeBalance = BigInt(nativeBalanceHex);

        if (isNative) {
          if (nativeBalance < tokensToSend + gasCost) {
            const chain = getChainById(chainId);
            const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
            setError(
              `Not enough ${nativeCurrencySymbol} in your wallet to cover network fees.`,
            );
            return false;
          }

          if (isMaxAmount && nativeBalance > gasCost) {
            const newTokensToSend = nativeBalance - gasCost;
            const price =
              selectedBalance.usdValue /
              Number.parseFloat(selectedBalance.balance);
            const newAmountFloat = Number.parseFloat(
              formatUnits(newTokensToSend, selectedBalance.decimals),
            );
            const newAmountInUSD = newAmountFloat * price;
            setAdjustedAmount(newAmountInUSD);
          }
        } else if (nativeBalance < gasCost) {
          const chain = getChainById(chainId);
          const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
          setError(
            `Not enough ${nativeCurrencySymbol} in your wallet to cover network fees.`,
          );
          return false;
        }

        return true;
      } catch (error) {
        console.warn(error);
        setError('Something went wrong. Try again in a few seconds.');
        return false;
      }
    },
    [wallets],
  );

  const sendWithdrawal = useCallback(
    async ({
      withdrawalAddress,
      chainId,
      isMaxAmount,
      selectedBalance,
      requestedUsdAmount,
      tokenAddress,
    }: SendWithdrawalArguments) => {
      setError(null);
      if (!requestedUsdAmount || !selectedBalance) {
        return;
      }
      setIsLoading(true);

      if (selectedBalance.usdValue <= 0) {
        setIsLoading(false);
        return;
      }

      const tokensToSend = calculateTokensToSend({
        isMaxAmount,
        balance: selectedBalance,
        requestedUsdAmount,
      });

      if (tokensToSend === null) {
        setIsLoading(false);
        return;
      }

      setAmountInTokens(tokensToSend);

      const isNative = tokenAddress === NULL_ADDRESS;
      const txRequest = isNative
        ? {
            to: withdrawalAddress,
            value: tokensToSend.toString(),
            data: undefined,
            chainId: chainId,
          }
        : {
            to: tokenAddress,
            value: '0',
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'transfer',
              args: [withdrawalAddress, tokensToSend],
            }),
            chainId: chainId,
          };

      try {
        const tx = await sendTransaction(txRequest, {
          uiOptions: {
            showWalletUIs: false,
          },
        });

        setTransactionHash(tx.hash);
        setIsLoading(false);
        setIsSuccess(true);
        onSuccess?.(tx.hash);
      } catch (error) {
        console.error('Failed to send transaction', error);
        let errorMessage = 'Something went wrong. Try again in a few seconds.';
        if (
          error instanceof Error &&
          (error.message.toLowerCase().includes('insufficient funds') ||
            error.message
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
    [sendTransaction, onSuccess, onError],
  );

  return {
    checkGasAndProceed,
    sendWithdrawal,
    isLoading,
    isSuccess,
    error,
    transactionHash,
    amountInTokens,
    adjustedAmount,
    reset,
  };
};
