import { Hex } from 'viem';
import { SolanaWallet } from '@idriss-xyz/wallet-connect';

import {
  GetEnsBalanceCommand,
  GetSolanaBalanceCommand,
} from 'application/trading-copilot';
import { useCommandQuery } from 'shared/messaging';
import { Wallet } from '@idriss-xyz/wallet-connect';

export const useAccountBalance = (
  wallet: Wallet | SolanaWallet | null | undefined,
) => {
  const command = wallet
    ? 'chainId' in wallet
      ? new GetEnsBalanceCommand({
          address: wallet.account ?? '',
          blockTag: 'safe',
        })
      : new GetSolanaBalanceCommand({
          address: wallet.account ?? '',
        })
    : new GetEnsBalanceCommand({
        address: '' as Hex,
        blockTag: 'safe',
      });

  const balanceQuery = useCommandQuery({
    command,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!wallet,
  });

  return balanceQuery.data;
};
