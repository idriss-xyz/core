import { useCommandQuery } from 'shared/messaging/command.hook';

import { GetTokenPriceCommand } from './get-token-price.command';
import { getUseGetTokenPriceQueryKey } from './get-token-price.library';
import { GetTokenPriceCommandDetails } from './get-token-price.types';

export const useGetTokenPriceCommandQuery = (
  details: GetTokenPriceCommandDetails,
) => {
  return useCommandQuery({
    queryKey: getUseGetTokenPriceQueryKey(details),
    command: new GetTokenPriceCommand(details),
    refetchInterval: 60_000, // each 1m,
  });
};
