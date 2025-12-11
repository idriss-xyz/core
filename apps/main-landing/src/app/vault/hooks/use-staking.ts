import { useCallback, useState } from 'react';
import {
  decodeFunctionResult,
  encodeFunctionData,
  Hex,
  parseEther,
} from 'viem';
import { base } from 'viem/chains';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import {
  useAccount,
  useSwitchChain,
  useWalletClient,
  useWriteContract,
} from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  EMPTY_HEX,
  ERC20_ABI,
  REWARDS_ADDRESS,
  REWARDS_ABI,
  STAKER_ADDRESS,
  STAKING_ABI,
  BASE_SUFFIX,
} from '@idriss-xyz/constants';
import { formatTokenValue } from '@idriss-xyz/utils';

import { useGetStakedBalance } from '@/app/vault/commands/get-staked-balance';
import { useGetUnstakedBalance } from '@/app/vault/commands/get-unstaked-balance';
import { IDRISS_TOKEN_ADDRESS } from '@/components/token-section/constants';

import { ApproveTokensPayload, StakePayload, UnstakePayload } from '../types';
import { useGetRewards } from '../commands/get-rewards';

export const useStaking = () => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  const stakedBalanceQuery = useGetStakedBalance({
    address: walletClient?.account.address ?? EMPTY_HEX,
  });
  const unstakedBalanceQuery = useGetUnstakedBalance({
    address: walletClient?.account.address ?? EMPTY_HEX,
  });
  const rewardsQuery = useGetRewards({
    address: walletClient?.account.address ?? EMPTY_HEX,
  });

  const [stakeIsPending, setStakeIsPending] = useState<boolean>(false);
  const [stakePendingAmount, setStakePendingAmount] = useState<number>(0);
  const [unstakeIsPending, setUnstakeIsPending] = useState<boolean>(false);
  const [unstakePendingAmount, setUnstakePendingAmount] = useState<number>(0);
  const [claimIsPending, setClaimIsPending] = useState<boolean>(false);
  const [claimPendingAmount, setClaimPendingAmount] = useState<number>(0);
  const [claimAndLockIsPending, setClaimAndLockIsPending] =
    useState<boolean>(false);

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

        const encodedData = (encodeFunctionData(approveData) +
          BASE_SUFFIX.slice(2)) as Hex;

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

          setStakeIsPending(true);
          setStakePendingAmount(payload.amount);

          const parsedAmount = parseEther(payload.amount.toString());

          await switchChainAsync({ chainId: base.id });

          await approveTokensCallback({
            walletClient,
            tokensToSend: BigInt(parsedAmount),
            writeContractAsync,
          });

          const stakeData = {
            abi: STAKING_ABI,
            functionName: 'stake',
            args: [parsedAmount],
          } as const;

          const encodedStakeData = (encodeFunctionData(stakeData) +
            BASE_SUFFIX.slice(2)) as Hex;

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

          await stakedBalanceQuery.refetch();
          await unstakedBalanceQuery.refetch();
          await rewardsQuery.refetch();

          setStakeIsPending(false);

          if (status === 'reverted') {
            throw new Error('Claim transaction reverted');
          }
        } catch (error) {
          setStakeIsPending(false);
          setStakePendingAmount(0);

          throw error;
        }
      }
    },
    [
      approveTokensCallback,
      isConnected,
      openConnectModal,
      stakedBalanceQuery,
      switchChainAsync,
      unstakedBalanceQuery,
      rewardsQuery,
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

          setUnstakeIsPending(true);
          setUnstakePendingAmount(payload.amount);

          const parsedAmount = parseEther(payload.amount.toString());

          await switchChainAsync({ chainId: base.id });

          const unstakeData = {
            abi: STAKING_ABI,
            functionName: 'withdraw',
            args: [parsedAmount],
          } as const;

          const encodedUnstakeData = (encodeFunctionData(unstakeData) +
            BASE_SUFFIX.slice(2)) as Hex;

          const gas = await estimateGas(walletClient, {
            to: STAKER_ADDRESS,
            data: encodedUnstakeData,
          }).catch((error) => {
            throw error;
          });

          const hash = await writeContractAsync({
            address: STAKER_ADDRESS,
            chain: base,
            ...unstakeData,
            gas,
          });

          const { status } = await waitForTransactionReceipt(walletClient, {
            hash,
          });

          await stakedBalanceQuery.refetch();
          await unstakedBalanceQuery.refetch();
          await rewardsQuery.refetch();

          setUnstakeIsPending(false);

          if (status === 'reverted') {
            throw new Error('Claim transaction reverted');
          }
        } catch (error) {
          setUnstakeIsPending(false);
          setUnstakePendingAmount(0);

          throw error;
        }
      }
    },
    [
      isConnected,
      openConnectModal,
      stakedBalanceQuery,
      switchChainAsync,
      unstakedBalanceQuery,
      rewardsQuery,
      walletClient,
      writeContractAsync,
    ],
  );

  const claimCallback = useCallback(async () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      try {
        if (!walletClient) {
          return;
        }

        setClaimIsPending(true);
        setClaimPendingAmount(Number.parseInt(rewardsQuery.data ?? '0'));
        await switchChainAsync({ chainId: base.id });

        const claimData = {
          abi: REWARDS_ABI,
          functionName: 'claim',
        } as const;

        const encodedClaimData = (encodeFunctionData(claimData) +
          BASE_SUFFIX.slice(2)) as Hex;

        const gas = await estimateGas(walletClient, {
          to: REWARDS_ADDRESS,
          data: encodedClaimData,
        }).catch((error) => {
          throw error;
        });

        const hash = await writeContractAsync({
          address: REWARDS_ADDRESS,
          chain: base,
          ...claimData,
          gas,
        });

        const { status } = await waitForTransactionReceipt(walletClient, {
          hash,
        });

        await stakedBalanceQuery.refetch();
        await unstakedBalanceQuery.refetch();
        await rewardsQuery.refetch();

        setClaimIsPending(false);

        if (status === 'reverted') {
          throw new Error('Claim transaction reverted');
        }
      } catch (error) {
        setClaimIsPending(false);
        setClaimPendingAmount(0);
        throw error;
      }
    }
  }, [
    isConnected,
    openConnectModal,
    stakedBalanceQuery,
    switchChainAsync,
    unstakedBalanceQuery,
    rewardsQuery,
    walletClient,
    writeContractAsync,
  ]);

  const claimAndLockCallback = useCallback(async () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      try {
        if (!walletClient) {
          return;
        }

        setClaimAndLockIsPending(true);
        setClaimPendingAmount(Number.parseInt(rewardsQuery.data ?? '0'));
        await switchChainAsync({ chainId: base.id });

        const claimData = {
          abi: REWARDS_ABI,
          functionName: 'claimAndLock',
        } as const;

        const encodedClaimData = (encodeFunctionData(claimData) +
          BASE_SUFFIX.slice(2)) as Hex;

        const gas = await estimateGas(walletClient, {
          to: REWARDS_ADDRESS,
          data: encodedClaimData,
        }).catch((error) => {
          throw error;
        });

        const hash = await writeContractAsync({
          address: REWARDS_ADDRESS,
          chain: base,
          ...claimData,
          gas,
        });

        const { status } = await waitForTransactionReceipt(walletClient, {
          hash,
        });

        await stakedBalanceQuery.refetch();
        await unstakedBalanceQuery.refetch();
        await rewardsQuery.refetch();

        setClaimAndLockIsPending(false);

        if (status === 'reverted') {
          throw new Error('Claim and Lock transaction reverted');
        }
      } catch (error) {
        setClaimAndLockIsPending(false);
        setClaimPendingAmount(0);
        throw error;
      }
    }
  }, [
    isConnected,
    openConnectModal,
    stakedBalanceQuery,
    switchChainAsync,
    unstakedBalanceQuery,
    rewardsQuery,
    walletClient,
    writeContractAsync,
  ]);

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

  const claim = {
    use: () => {
      return claimCallback();
    },
    isPending: claimIsPending,
    pendingAmount: claimPendingAmount,
  };

  const claimAndLock = {
    use: () => {
      return claimAndLockCallback();
    },
    isPending: claimAndLockIsPending,
    pendingAmount: claimPendingAmount,
  };

  const stakedBalance = {
    amount: stakedBalanceQuery.data ?? '0',
    refetch: stakedBalanceQuery.refetch,
    isError: stakedBalanceQuery.isError,
    isPending: stakedBalanceQuery.isPending,
    isSuccess: stakedBalanceQuery.isSuccess,
    formattedAmount: stakedBalanceQuery.data
      ? formatTokenValue(Number(stakedBalanceQuery.data))
      : '0',
  };

  const unstakedBalance = {
    amount: unstakedBalanceQuery.data ?? '0',
    refetch: unstakedBalanceQuery.refetch,
    isError: unstakedBalanceQuery.isError,
    isPending: unstakedBalanceQuery.isPending,
    isSuccess: unstakedBalanceQuery.isSuccess,
    formattedAmount: unstakedBalanceQuery.data
      ? formatTokenValue(Number(unstakedBalanceQuery.data))
      : '0',
  };

  const rewards = {
    amount: rewardsQuery.data ?? '0',
    refetch: rewardsQuery.refetch,
    isError: rewardsQuery.isError,
    isPending: rewardsQuery.isPending,
    isSuccess: rewardsQuery.isSuccess,
    formattedAmount: rewardsQuery.data
      ? formatTokenValue(Number(rewardsQuery.data))
      : '0',
  };

  const totalStakedBalance = {
    amount: `${Number(stakedBalanceQuery.data ?? 0)}`,
    formattedAmount: stakedBalanceQuery.isSuccess
      ? formatTokenValue(Number(stakedBalanceQuery.data ?? 0))
      : '0',
  };

  return {
    stake,
    account,
    unstake,
    walletClient,
    stakedBalance,
    unstakedBalance,
    totalStakedBalance,
    rewards,
    claim,
    claimAndLock,
  };
};
