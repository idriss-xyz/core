import { useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { Pagination } from 'shared/ui';

import { getAgoraUsernameFromTwitterUsername } from '../utils';
import { GetAgoraProposalsCommand } from '../commands';

import { Proposal } from './proposal';

interface Properties {
  handle: string;
}

export const ProposalHandleContainer = ({ handle }: Properties) => {
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  const agoraUsername = getAgoraUsernameFromTwitterUsername(handle);
  const proposalQuery = useCommandQuery({
    command: new GetAgoraProposalsCommand({
      limit: 1,
      offset: currentProposalIndex,
    }),
    enabled: agoraUsername ? agoraUsername.length > 0 : false,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const currentProposal = proposalQuery.data?.proposals?.at(0);
  const isLoadingProposal =
    proposalQuery.isLoading || proposalQuery.isPlaceholderData;

  const isPreviousProposalAvailable = currentProposalIndex > 0;
  const isNextProposalAvailable = Boolean(
    proposalQuery.data?.metadata.has_next,
  );

  const showPreviousProposal = () => {
    if (!isPreviousProposalAvailable || isLoadingProposal) {
      return;
    }

    setCurrentProposalIndex((previous) => {
      return previous - 1;
    });
  };

  const showNextProposal = () => {
    if (!isNextProposalAvailable || isLoadingProposal) {
      return;
    }

    setCurrentProposalIndex((previous) => {
      return previous + 1;
    });
  };

  const pagination: Pagination = {
    hasPrevious: isPreviousProposalAvailable,
    hasNext: isNextProposalAvailable,
    onPrevious: showPreviousProposal,
    onNext: showNextProposal,
  };

  if (!currentProposal || !agoraUsername) {
    return null;
  }

  return (
    <Proposal
      pagination={pagination}
      isLoading={isLoadingProposal}
      data={currentProposal}
      className="fixed top-20"
    />
  );
};
