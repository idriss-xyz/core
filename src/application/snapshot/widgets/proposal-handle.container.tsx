import { useCommandQuery } from 'shared/messaging';

import { GetProposalCommand } from '../commands';
import { getSnapshotFromTwitterUsername } from '../utils';

import { Proposal } from './proposal';

interface Properties {
  handle: string;
}

export const ProposalHandleContainer = ({ handle }: Properties) => {
  const snapshotName = getSnapshotFromTwitterUsername(handle);

  const proposalQuery = useCommandQuery({
    command: new GetProposalCommand({ snapshotName: snapshotName ?? '' }),
    enabled: snapshotName ? snapshotName.length > 0 : false,
  });

  if (!proposalQuery.data || !snapshotName) {
    return null;
  }

  return <Proposal data={proposalQuery.data} className="fixed top-20" />;
};
