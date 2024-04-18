import { useQuery } from '@tanstack/react-query';

import { GetTokensBooksCommand } from '../../commands';

import { UseTokensBooksArguments } from './use-tokens-books.types';

const getTokensBooks = async (tokensIds: string[]) => {
  const command = new GetTokensBooksCommand({ tokensIds });
  return command.send();
};

export const useTokensBooks = ({ tokensIds }: UseTokensBooksArguments) => {
  return useQuery({
    enabled: tokensIds.length > 0,
    queryKey: ['getTokensBooks', ...tokensIds],
    queryFn: () => {
      return getTokensBooks(tokensIds);
    },
  });
};
