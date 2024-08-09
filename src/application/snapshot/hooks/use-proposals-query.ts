import { useCommandQuery } from 'shared/messaging';

import { GetProposalCommand } from '../commands';

interface Properties {
  officialName: string;
  pageNumber: number;
  enabled?: boolean;
}

export const useProposalsQuery = ({
  officialName,
  pageNumber,
  enabled,
}: Properties) => {
  return useCommandQuery({
    command: new GetProposalCommand({
      snapshotNames: [officialName],
      pageNumber,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: (previousData) => {
      return previousData;
    },
    enabled,
  });
};
