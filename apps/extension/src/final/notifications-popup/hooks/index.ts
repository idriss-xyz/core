import { Wallet as SolanaWallet } from '@solana/wallet-adapter-react';

import { Wallet } from 'shared/web3';
import {
  GetEnsBalanceCommand,
  GetSolanaBalanceCommand,
} from 'application/trading-copilot';
import { useCommandQuery } from 'shared/messaging';

export const useAccountBalance = (wallet: Wallet | SolanaWallet) => {

  const command = 'adapter' in wallet
  ? new GetSolanaBalanceCommand({
    address: wallet.adapter.publicKey?.toString() ?? '',
  })
  : new GetEnsBalanceCommand({
    address: wallet.account ?? '',
    blockTag: 'safe',
  });

  const balanceQuery = useCommandQuery({
    command,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return balanceQuery.data;
};
