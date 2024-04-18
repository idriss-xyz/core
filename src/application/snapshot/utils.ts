/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TwitterUserPoolingResult } from 'shared/twitter';

import { SNAPSHOT_WEBSITE_URL, TWITTER_HANDLE_TO_SNAPSHOT } from './constants';
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

export const getSnapshotFromTwitterUsername = (handle: string) => {
  return TWITTER_HANDLE_TO_SNAPSHOT[handle.toLowerCase()];
};

export const getDaysUntil = (dateInMs: number) => {
  const currentDate = new Date();

  // Set the time of the current date to 00:00:00 for accurate day difference calculation
  currentDate.setHours(0, 0, 0, 0);

  // Create a new date object for the target date, also set to 00:00:00
  const targetDate = new Date(dateInMs);
  targetDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  const differenceInMillis = targetDate.getTime() - currentDate.getTime();

  // Convert the difference from milliseconds to days
  const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

  return Math.round(differenceInDays);
};

export const getEndsInLabel = (daysUntil: number) => {
  if (daysUntil < 0) {
    return '-';
  }

  if (daysUntil === 0) {
    return 'Ends today';
  }

  if (daysUntil === 1) {
    return 'Ends in 1 day';
  }

  return `Ends in ${daysUntil} days`;
};

export const getProposalAuthor = (proposal: ProposalData) => {
  return (
    proposal.author.resolvedAddress ??
    `${proposal.author.address.slice(0, 6)}...${proposal.author.address.slice(Math.max(0, proposal.author.address.length - 4))}`
  );
};

export const getSnapshotUsernameNodes = (
  poolingResults: TwitterUserPoolingResult[],
) => {
  return poolingResults
    .map((result) => {
      const snapshotName = getSnapshotFromTwitterUsername(result.username);
      if (!snapshotName) {
        return;
      }

      return {
        snapshotName,
        ...result,
      };
    })
    .filter(Boolean);
};
