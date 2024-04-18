import { useQuery } from '@tanstack/react-query';

import { GetProposalsCommand } from '../commands';

const getProposals = (snapshotNames: string[]) => {
  const command = new GetProposalsCommand({ snapshotNames });
  return command.send();
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
