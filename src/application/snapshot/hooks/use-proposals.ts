import { useQuery } from '@tanstack/react-query';

import { GetProposalsCommand } from '../commands';
import { ProposalData } from '../types';

const getProposals = (snapshotNames: string[]) => {
  const command = new GetProposalsCommand({ snapshotNames });
  return command.send<ProposalData[]>();
};

export const useProposals = (snapshotNames: string[]) => {
  return useQuery({
    queryKey: ['proposal', ...snapshotNames],
    placeholderData: (previousData) => {
      return previousData;
    },
    queryFn: () => {
      return getProposals(snapshotNames);
    },
  });
};
