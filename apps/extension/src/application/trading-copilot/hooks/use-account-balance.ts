import { Hex } from 'viem';
import { SolanaWallet, Wallet } from '@idriss-xyz/wallet-connect';

import {
  GetEthBalanceCommand,
  GetSolanaBalanceCommand,
} from 'application/trading-copilot';
import { useCommandQuery } from 'shared/messaging';

export const useAccountBalance = (
  wallet: Wallet | SolanaWallet | null | undefined,
) => {
  const command = wallet
    ? 'chainId' in wallet
      ? new GetEthBalanceCommand({
          address: wallet.account ?? '',
          blockTag: 'safe',
        })
      : new GetSolanaBalanceCommand({
          address: wallet.account ?? '',
        })
    : new GetEthBalanceCommand({
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
