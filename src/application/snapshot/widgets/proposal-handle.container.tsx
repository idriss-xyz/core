import { useCommandQuery } from 'shared/messaging';
import { useHandleToUsernameMap } from 'host/twitter';

import { GetProposalCommand } from '../commands';

import { Proposal } from './proposal';

interface Properties {
  handle: string;
}

export const ProposalHandleContainer = ({ handle }: Properties) => {
  const { data: daoHandles } = useHandleToUsernameMap('snapshot');
  const snapshotName = daoHandles
    ? daoHandles[handle.toLowerCase()]
    : undefined;

  const proposalQuery = useCommandQuery({
    command: new GetProposalCommand({ snapshotName: snapshotName ?? '' }),
    enabled: snapshotName ? snapshotName.length > 0 : false,
  });

  if (!proposalQuery.data || !snapshotName) {
    return null;
  }

  return <Proposal data={proposalQuery.data} className="fixed top-20" />;
};
