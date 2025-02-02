import { Hex } from '@idriss-xyz/wallet-connect';

import { useGetStakedBalance } from '@/app/vault/commands/get-staked-balance';
import { useGetBonusStakedBalance } from '@/app/vault/commands/get-bonus-staked-balance';
import { useGetUnStakedBalance } from '@/app/vault/commands/get-unstaked-balance';
import { formatNumber } from '@/app/claim/components/claim/components/idriss-user-criteria-description';

interface Properties {
  address: Hex;
}

export const useStaking = ({ address }: Properties) => {
  const stakedBalanceQuery = useGetStakedBalance({ address });
  const unStakedBalanceQuery = useGetUnStakedBalance({ address });
  const stakedBonusBalanceQuery = useGetBonusStakedBalance({ address });

  const stakedBalance = {
    amount: stakedBalanceQuery.data,
    refetch: stakedBalanceQuery.refetch,
    isError: stakedBalanceQuery.isError,
    isSending: stakedBalanceQuery.isPending,
    isSuccess: stakedBalanceQuery.isSuccess,
    formattedAmount: formatNumber(Number(stakedBalanceQuery.data), 2),
  };

  const unStakedBalance = {
    amount: unStakedBalanceQuery.data,
    refetch: unStakedBalanceQuery.refetch,
    isError: unStakedBalanceQuery.isError,
    isSending: unStakedBalanceQuery.isPending,
    isSuccess: unStakedBalanceQuery.isSuccess,
    formattedAmount: formatNumber(Number(unStakedBalanceQuery.data), 2),
  };

  const stakedBonusBalance = {
    amount: stakedBonusBalanceQuery.data,
    refetch: stakedBonusBalanceQuery.refetch,
    isError: stakedBonusBalanceQuery.isError,
    isSending: stakedBonusBalanceQuery.isPending,
    isSuccess: stakedBonusBalanceQuery.isSuccess,
    formattedAmount: formatNumber(Number(stakedBonusBalanceQuery.data), 2),
  };

  return {
    stakedBalance,
    unStakedBalance,
    stakedBonusBalance,
  };
};
