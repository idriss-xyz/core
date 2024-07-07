import { useState } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { Pagination } from 'shared/ui';

import { GetProposalCommand } from '../commands';

import { Proposal } from './proposal';

interface Properties {
  snapshotHandle: string;
  className?: string;
  top?: number;
  onClose?: () => void;
}

export const OrganizationProposalsContainer = ({
  snapshotHandle,
  className = 'fixed top-20',
  top,
  onClose,
}: Properties) => {
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  const proposalQuery = useCommandQuery({
    command: new GetProposalCommand({
      snapshotNames: [snapshotHandle],
      pageNumber: currentProposalIndex,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const currentProposal = proposalQuery.data?.proposal;

  const isLoadingProposal =
    proposalQuery.isLoading || proposalQuery.isPlaceholderData;

  const isPreviousProposalAvailable = currentProposalIndex > 0;
  const isNextProposalAvailable =
    Boolean(proposalQuery.data?.hasNextProposal) && !isLoadingProposal;

  const showPreviousProposal = () => {
    if (!isPreviousProposalAvailable) {
      return;
    }

    setCurrentProposalIndex((previous) => {
      return previous - 1;
    });
  };

  const showNextProposal = () => {
    if (!isNextProposalAvailable) {
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

  if (!currentProposal || !snapshotHandle) {
    return null;
  }

  return (
    <Proposal
      pagination={pagination}
      isLoading={isLoadingProposal}
      data={currentProposal}
      className={className}
      top={top}
      onClose={onClose}
    />
  );
};
