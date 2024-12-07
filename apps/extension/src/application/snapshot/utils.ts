import { SNAPSHOT_WEBSITE_URL } from './constants';
import { ProposalData } from './types';

export const generateGetProposalsQuery = () => {
  return `query Proposals($first: Int,$skip: Int , $snapshotNames: [String!]) {
      proposals (
        first: $first,
        skip: $skip,
        where: {
          space_in: $snapshotNames,
          state: "active"
        },
        orderBy: "end",
        orderDirection: asc
      ) {
        id
        title
        body
        end
        author
        space {
          id
        }
      }
    }`;
};

export const getProposalUrl = (snapshotName: string, proposalId: string) => {
  return `${SNAPSHOT_WEBSITE_URL}/#/${snapshotName}/proposal/${proposalId}`;
};

export const getUserUrl = (userId: string) => {
  return `${SNAPSHOT_WEBSITE_URL}/#/profile/${userId}`;
};

export const getProposalAuthor = (proposal: ProposalData) => {
  return (
    proposal.author.resolvedAddress ??
    `${proposal.author.address.slice(0, 6)}...${proposal.author.address.slice(Math.max(0, proposal.author.address.length - 4))}`
  );
};
