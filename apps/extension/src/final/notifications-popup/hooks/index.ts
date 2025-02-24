import { Wallet as SolanaWallet } from '@solana/wallet-adapter-react';
import { Hex } from 'viem';

import {
  GetEnsBalanceCommand,
  GetSolanaBalanceCommand,
} from 'application/trading-copilot';
import { useCommandQuery } from 'shared/messaging';
import { Wallet } from 'shared/web3';

export const useAccountBalance = (
  wallet: Wallet | SolanaWallet | null | undefined,
) => {
  const command = wallet
    ? 'adapter' in wallet
      ? new GetSolanaBalanceCommand({
          address: wallet.adapter.publicKey?.toString() ?? '',
        })
      : new GetEnsBalanceCommand({
          address: wallet.account ?? '',
          blockTag: 'safe',
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
