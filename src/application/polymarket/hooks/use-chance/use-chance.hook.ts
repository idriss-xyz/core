import { useQuery } from '@tanstack/react-query';

import { GetTokenChanceCommand } from '../../commands';

import { UseTokenChanceArguments } from './use-chance.types';

const getTokenChance = async (tokenId: string) => {
  const command = new GetTokenChanceCommand({ tokenId });
  return command.send<number>();
};

export const useChance = ({ tokenId }: UseTokenChanceArguments) => {
  return useQuery({
    queryKey: ['getChance', tokenId],
    queryFn: () => {
      return getTokenChance(tokenId);
    },
    enabled: tokenId.length > 0,
  });
};
