import { useProposal } from '../../hooks';
import { Proposal } from '../proposal';

interface Properties {
  snapshotName: string;
}

export const Container = ({ snapshotName }: Properties) => {
  const proposalQuery = useProposal(snapshotName);

  if (!proposalQuery.data) {
    return null;
  }

  return <Proposal data={proposalQuery.data} className="fixed top-20" />;
};
