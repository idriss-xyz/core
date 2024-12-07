import { useCommandQuery } from 'shared/messaging';

import { GetTallyProposalsCommand } from '../commands';

interface Properties {
  username: string;
  afterCursor: string | null;
  enabled?: boolean;
}

export const useProposalsQuery = ({
  afterCursor,
  username,
  enabled = true,
}: Properties) => {
  return useCommandQuery({
    command: new GetTallyProposalsCommand({
      username,
      afterCursor,
    }),
    retry: 5,
    retryDelay: 1800,
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
    placeholderData: (previousData) => {
      return previousData;
    },
  });
};
