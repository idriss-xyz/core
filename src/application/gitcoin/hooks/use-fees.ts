import { useCommandQuery } from 'shared/messaging';

import {
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
  GITCOIN_DONATION_CHAINS_IDS,
  WRAPPED_ETH_ADDRESS_PER_CHAIN_ID,
} from '../constants';
import { Application } from '../types';
import { GetGitcoinAcrossChainFeesCommand } from '../commands';

interface Properties {
  application: Application;
  amountInWei: number;
  enabled: boolean;
}

export const useFees = ({ application, amountInWei, enabled }: Properties) => {
  return useCommandQuery({
    command: new GetGitcoinAcrossChainFeesCommand({
      amount: amountInWei,
      roundId: Number(application.roundId),
      anchorAddress: application.project.anchorAddress,
      recipient:
        DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
      destinationChainId: application.chainId,
      chains: GITCOIN_DONATION_CHAINS_IDS.filter((id) => {
        return id !== application.chainId;
      }).map((id) => {
        return {
          id,
          wrappedEthAddress: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[id] ?? '',
        };
      }),
    }),
    enabled: enabled && amountInWei > 0,
    refetchInterval: 60_000, // each 1m,
    retry: 0,
  });
};
