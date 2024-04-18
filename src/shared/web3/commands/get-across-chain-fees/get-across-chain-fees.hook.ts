import { useCommandQuery } from 'shared/messaging/command.hook';

import { getUseGetAcrossChainFeesQueryKey } from './get-across-chain-fees.library';
import { GetAcrossChainFeesCommand } from './get-across-chain-fees.command';
import { GetAcrossChainFeesCommandDetails } from './get-across-chain-fees.types';

export const useGetAcrossChainFeesCommandQuery = (
  details: GetAcrossChainFeesCommandDetails,
  options: {
    enabled?: boolean;
  } = {},
) => {
  return useCommandQuery({
    queryKey: getUseGetAcrossChainFeesQueryKey(details),
    command: new GetAcrossChainFeesCommand(details),
    enabled: options?.enabled ?? Number(details.amount) > 0,
    refetchInterval: 60_000, // each 1m,
    retry: 3,
  });
};
