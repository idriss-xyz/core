import { useQuery } from '@tanstack/react-query';

import { GetProposalCommand } from '../commands';

const getProposal = (snapshotName: string) => {
  const command = new GetProposalCommand({ snapshotName });
  return command.send();
};

export const useProposal = (snapshotName: string) => {
  return useQuery({
    queryKey: ['proposal', snapshotName],
    queryFn: () => {
      return getProposal(snapshotName);
    },
  });
};
