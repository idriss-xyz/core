import { Hex } from 'viem';
import { SolanaWallet, Wallet } from '@idriss-xyz/wallet-connect';

import { GetSolanaBalanceCommand } from 'application/trading-copilot';
import { useCommandQuery } from 'shared/messaging';
import { GetEthBalanceCommand } from 'shared/web3';

export const useAccountBalance = (
  wallet: Wallet | SolanaWallet | null | undefined,
) => {
  const command = wallet
    ? 'chainId' in wallet
      ? new GetEthBalanceCommand({
          address: wallet.account ?? '',
          blockTag: 'safe',
          chainId: wallet.chainId,
        })
      : new GetSolanaBalanceCommand({
          address: wallet.account ?? '',
        })
    : new GetEthBalanceCommand({
        address: '' as Hex,
        blockTag: 'safe',
        chainId: 1,
      });

  const balanceQuery = useCommandQuery({
    command,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!wallet,
  });

  return balanceQuery.data;
};
