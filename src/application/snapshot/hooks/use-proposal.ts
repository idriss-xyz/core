import { useQuery } from '@tanstack/react-query';

import { GetProposalCommand } from '../commands';
import { ProposalData } from '../types';

const getProposal = (snapshotName: string) => {
  const command = new GetProposalCommand({ snapshotName });
  return command.send<ProposalData>();
};

export const useProposal = (snapshotName: string) => {
  return useQuery({
    queryKey: ['proposal', snapshotName],
    queryFn: () => {
      return getProposal(snapshotName);
    },
  });
};
