import { GetAcrossChainFeesCommand } from 'shared/web3';
import { useCommandQuery } from 'shared/messaging';

import {
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
  GITCOIN_DONATION_CHAINS_IDS,
  SMALLEST_AMOUNT_MESSAGE_PER_CHAIN_ID,
  WRAPPED_ETH_ADDRESS_PER_CHAIN_ID,
} from '../constants';
import { Application } from '../types';

interface Properties {
  application: Application;
  amountInWei: number;
  enabled: boolean;
}

export const useFees = ({ application, amountInWei, enabled }: Properties) => {
  const payload = {
    destinationChainId: application.chainId,
    chains: GITCOIN_DONATION_CHAINS_IDS.filter((id) => {
      return id !== application.chainId;
    }).map((id) => {
      return {
        id,
        wrappedEthAddress: WRAPPED_ETH_ADDRESS_PER_CHAIN_ID[id] ?? '',
      };
    }),
    amount: amountInWei.toString(),
    message: SMALLEST_AMOUNT_MESSAGE_PER_CHAIN_ID[application.chainId] ?? '',
    recipient:
      DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
  };

  return useCommandQuery({
    command: new GetAcrossChainFeesCommand(payload),
    enabled: enabled ?? Number(payload.amount) > 0,
    refetchInterval: 60_000, // each 1m,
    retry: 3,
  });
};
