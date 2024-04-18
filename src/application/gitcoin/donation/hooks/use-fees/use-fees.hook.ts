import { useGetAcrossChainFeesCommandQuery } from 'shared/web3';

import {
  DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID,
  GITCOIN_DONATION_CHAINS_IDS,
  SMALLEST_AMOUNT_MESSAGE_PER_CHAIN_ID,
  WRAPPED_ETH_ADDRESS_PER_CHAIN_ID,
} from '../../donation.constants';

import { UseFeesProperties } from './use-fees.types';

export const useFees = ({
  application,
  amountInWei,
  enabled,
}: UseFeesProperties) => {
  return useGetAcrossChainFeesCommandQuery(
    {
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
      recipient: DONATION_CONTRACT_ADDRESS_PER_CHAIN_ID[application.chainId] ?? '',
    },
    {
      enabled,
    },
  );
};
