import { useCommandQuery } from 'shared/messaging';

import { GetAgoraProposalsCommand } from '../commands';

interface Properties {
  offset: number;
  enabled?: boolean;
}

export const useProposalsQuery = ({ offset, enabled = true }: Properties) => {
  return useCommandQuery({
    command: new GetAgoraProposalsCommand({
      offset,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled,
  });
};
