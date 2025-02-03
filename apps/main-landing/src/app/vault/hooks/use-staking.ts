import { useCallback, useState } from 'react';
import { decodeFunctionResult, encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { STAKER_ADDRESS, StakingABI } from '@idriss-xyz/constants';

import { useGetStakedBalance } from '@/app/vault/commands/get-staked-balance';
import { useGetBonusStakedBalance } from '@/app/vault/commands/get-bonus-staked-balance';
import { useGetUnstakedBalance } from '@/app/vault/commands/get-unstaked-balance';
import { formatNumber } from '@/app/claim/components/claim/components/idriss-user-criteria-description';
import { ERC20_ABI } from '@/app/creators/donate/constants';
import { IDRISS_TOKEN_ADDRESS } from '@/components/token-section/constants';

import { ApproveTokensPayload, StakePayload, UnstakePayload } from '../types';

export const useStaking = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const stakedBalanceQuery = useGetStakedBalance({
    address: walletClient?.account.address ?? '0x',
  });
  const unStakedBalanceQuery = useGetUnstakedBalance({
    address: walletClient?.account.address ?? '0x',
  });
  const stakedBonusBalanceQuery = useGetBonusStakedBalance({
    address: walletClient?.account.address ?? '0x',
  });

  const [stakeIsPending, setStakeIsPending] = useState<boolean>(false);
  const [stakePendingAmount, setStakePendingAmount] = useState<number>(0);
  const [unstakeIsPending, setUnstakeIsPending] = useState<boolean>(false);
  const [unstakePendingAmount, setUnstakePendingAmount] = useState<number>(0);

  const approveTokensCallback = useCallback(
    async (payload: ApproveTokensPayload) => {
      if (!payload.walletClient.account) {
        return;
      }

      const allowanceData = {
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [payload.walletClient.account.address, STAKER_ADDRESS],
      } as const;

      const encodedAllowanceData = encodeFunctionData(allowanceData);

      const allowanceRaw = await call(payload.walletClient, {
        account: payload.walletClient.account,
        to: IDRISS_TOKEN_ADDRESS,
        data: encodedAllowanceData,
      });

      if (allowanceRaw.data === undefined) {
        throw new Error('Allowance data is not defined');
      }

      const allowanceNumber = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'allowance',
        data: allowanceRaw.data,
      });

      if (allowanceNumber < payload.tokensToSend) {
        const approveData = {
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [STAKER_ADDRESS, payload.tokensToSend],
        } as const;

        const encodedData = encodeFunctionData(approveData);

        const gas = await estimateGas(payload.walletClient, {
          to: IDRISS_TOKEN_ADDRESS,
          data: encodedData,
        });

        const hash = await payload.writeContractAsync({
          chain: base,
          address: IDRISS_TOKEN_ADDRESS,
          ...approveData,
          gas,
        });

        const receipt = await waitForTransactionReceipt(payload.walletClient, {
          hash,
        });

        if (receipt.status === 'reverted') {
          console.error('Error approving tokens');
        }
      }
    },
    [],
  );

  const stakeCallback = useCallback(
    async (payload: StakePayload) => {
      if (!isConnected && openConnectModal) {
        openConnectModal();
      } else {
        try {
          if (!walletClient) {
            return;
          }

          const parsedAmount = parseEther(payload.amount.toString());

          await switchChainAsync({ chainId: base.id });

          setStakeIsPending(true);
          setStakePendingAmount(payload.amount);

          await approveTokensCallback({
            walletClient,
            tokensToSend: BigInt(parsedAmount),
            writeContractAsync,
          });

          const stakeData = {
            abi: StakingABI,
            functionName: 'stake',
            args: [parsedAmount],
          };

          const encodedStakeData = encodeFunctionData(stakeData);

          const gas = await estimateGas(walletClient, {
            to: STAKER_ADDRESS,
            data: encodedStakeData,
          }).catch((error) => {
            throw error;
          });

          const hash = await writeContractAsync({
            address: STAKER_ADDRESS,
            chain: base,
            ...stakeData,
            gas,
          });

          const { status } = await waitForTransactionReceipt(walletClient, {
            hash,
          });

          setStakeIsPending(false);
          void unStakedBalanceQuery.refetch();

          if (status === 'reverted') {
            throw new Error('Claim transaction reverted');
          }
        } catch (error) {
          setStakeIsPending(false);
          setStakePendingAmount(0);

          console.error('Error locking:', error);
          throw error;
        }
      }
    },
    [
      approveTokensCallback,
      isConnected,
      openConnectModal,
      switchChainAsync,
      unStakedBalanceQuery,
      walletClient,
      writeContractAsync,
    ],
  );

  const unstakeCallback = useCallback(
    async (payload: StakePayload) => {
      if (!isConnected && openConnectModal) {
        openConnectModal();
      } else {
        try {
          if (!walletClient) {
            return;
          }

          const parsedAmount = parseEther(payload.amount.toString());

          await switchChainAsync({ chainId: base.id });

          setUnstakeIsPending(true);
          setUnstakePendingAmount(payload.amount);

          const stakeData = {
            abi: StakingABI,
            functionName: 'stake',
            args: [parsedAmount],
          };

          const encodedStakeData = encodeFunctionData(stakeData);

          const gas = await estimateGas(walletClient, {
            to: STAKER_ADDRESS,
            data: encodedStakeData,
          }).catch((error) => {
            throw error;
          });

          const hash = await writeContractAsync({
            address: STAKER_ADDRESS,
            chain: base,
            ...stakeData,
            gas,
          });

          const { status } = await waitForTransactionReceipt(walletClient, {
            hash,
          });

          setUnstakeIsPending(false);
          void unStakedBalanceQuery.refetch();

          if (status === 'reverted') {
            throw new Error('Claim transaction reverted');
          }
        } catch (error) {
          setUnstakeIsPending(false);
          setUnstakePendingAmount(0);

          console.error('Error locking:', error);
          throw error;
        }
      }
    },
    [
      isConnected,
      openConnectModal,
      switchChainAsync,
      unStakedBalanceQuery,
      walletClient,
      writeContractAsync,
    ],
  );

  const account = {
    isConnected,
  };

  const stake = {
    use: (payload: StakePayload) => {
      return stakeCallback(payload);
    },
    isPending: stakeIsPending,
    pendingAmount: stakePendingAmount,
  };

  const unstake = {
    use: (payload: UnstakePayload) => {
      return unstakeCallback(payload);
    },
    isPending: unstakeIsPending,
    pendingAmount: unstakePendingAmount,
  };

  const stakedBalance = {
    amount: stakedBalanceQuery.data ?? 0,
    refetch: stakedBalanceQuery.refetch,
    isError: stakedBalanceQuery.isError,
    isPending: stakedBalanceQuery.isPending,
    isSuccess: stakedBalanceQuery.isSuccess,
    formattedAmount: stakedBalanceQuery.data
      ? formatNumber(Number(stakedBalanceQuery.data), 2)
      : '—',
  };

  const unStakedBalance = {
    amount: unStakedBalanceQuery.data ?? 0,
    refetch: unStakedBalanceQuery.refetch,
    isError: unStakedBalanceQuery.isError,
    isPending: unStakedBalanceQuery.isPending,
    isSuccess: unStakedBalanceQuery.isSuccess,
    formattedAmount: unStakedBalanceQuery.data
      ? formatNumber(Number(unStakedBalanceQuery.data), 2)
      : '—',
  };

  const stakedBonusBalance = {
    amount: stakedBonusBalanceQuery.data ?? 0,
    refetch: stakedBonusBalanceQuery.refetch,
    isError: stakedBonusBalanceQuery.isError,
    isPending: stakedBonusBalanceQuery.isPending,
    isSuccess: stakedBonusBalanceQuery.isSuccess,
    formattedAmount: stakedBonusBalanceQuery.data
      ? formatNumber(Number(stakedBonusBalanceQuery.data), 2)
      : '—',
  };

  // TODO: use this number function?
  // setTotalLockedDisplayAmount(
  //   new Intl.NumberFormat('en-US', {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).format(Number(formatEther(totalLocked) ?? 0)),
  // );
  const totalStakedBalance = {
    amount:
      Number(stakedBalanceQuery.data ?? 0) +
      Number(stakedBonusBalanceQuery.data ?? 0),
    formattedAmount:
      stakedBalanceQuery.isSuccess && stakedBonusBalanceQuery.isSuccess
        ? formatNumber(
            Number(stakedBalanceQuery.data ?? 0) +
              Number(stakedBonusBalanceQuery.data ?? 0),
            2,
          )
        : '—',
  };

  return {
    stake,
    account,
    unstake,
    walletClient,
    stakedBalance,
    unStakedBalance,
    stakedBonusBalance,
    totalStakedBalance,
  };
};
