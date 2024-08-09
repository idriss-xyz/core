import { useState } from 'react';

import { Pagination } from 'shared/ui';
import { ErrorBoundary } from 'shared/observability';

import { useProposalsQuery } from '../hooks';

import { Proposal } from './proposal';

interface Properties {
  className?: string;
  onClose?: () => void;
  officialName: string;
}

const Base = ({ className, officialName, onClose }: Properties) => {
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  const proposalQuery = useProposalsQuery({
    officialName,
    pageNumber: currentProposalIndex,
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

  if (!currentProposal || !officialName) {
    return null;
  }

  return (
    <Proposal
      pagination={pagination}
      isLoading={isLoadingProposal}
      data={currentProposal}
      className={className}
      onClose={onClose}
    />
  );
};

export const OrganizationProposalsContainer = (properties: Properties) => {
  return (
    <ErrorBoundary>
      <Base {...properties} />
    </ErrorBoundary>
  );
};
