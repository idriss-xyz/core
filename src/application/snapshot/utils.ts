/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { SNAPSHOT_WEBSITE_URL } from './constants';
import { GetProposalsOptions, ProposalData } from './types';

export const generateGetProposalsQuery = (
  snapshotNames: string[],
  options: GetProposalsOptions,
) => {
  // TODO: use GQL variables for this
  return `query Proposals {
  proposals (
    first: ${options.first},
    skip: 0,
    where: {
      space_in: [${snapshotNames.map((name) => {
        return `"${name}"`;
      })}],
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
