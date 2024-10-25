import { useEffect, useState } from 'react';

import { Pagination } from 'shared/ui';
import { ErrorBoundary } from 'shared/observability';

import { useProposalsQuery } from '../hooks';

import { Proposal } from './proposal';

interface Properties {
  className?: string;
  onClose?: () => void;
  username: string;
}

const Base = ({ className, onClose, username }: Properties) => {
  const [previousProposalCursors, setPreviousProposalCursors] = useState<
    (string | null)[]
  >([]);
  const [currentProposalCursor, setCurrentProposalCursor] = useState<
    string | null
  >(null);
  const [nextProposalCursor, setNextProposalCursor] = useState<string | null>(
    null,
  );

  const proposalQuery = useProposalsQuery({
    username,
    afterCursor: currentProposalCursor,
  });

  const currentProposal = proposalQuery.data?.nodes[0];
  const nextProposal = proposalQuery.data?.nodes[1];

  const isLoadingProposal =
    proposalQuery.isLoading || proposalQuery.isPlaceholderData;
  const isPreviousProposalAvailable = previousProposalCursors.length > 0;
  const isNextProposalAvailable =
    nextProposal !== undefined && !isLoadingProposal;

  const showPreviousProposal = () => {
    const previousProposalCursor = previousProposalCursors.at(-1);
    if (
      !isPreviousProposalAvailable ||
      isLoadingProposal ||
      previousProposalCursor === undefined
    ) {
      return;
    }

    setNextProposalCursor(currentProposalCursor);
    setCurrentProposalCursor(previousProposalCursor);
    setPreviousProposalCursors((previous) => {
      return previous.slice(0, -1);
    });
  };

  const showNextProposal = () => {
    if (!isNextProposalAvailable) {
      return;
    }

    setCurrentProposalCursor(nextProposalCursor);
    setPreviousProposalCursors((previous) => {
      return [...previous, currentProposalCursor];
    });
  };

  useEffect(() => {
    if (isLoadingProposal) {
      return;
    }

    const newFetchedProposalInfo = proposalQuery.data;
    if (newFetchedProposalInfo) {
      setNextProposalCursor(newFetchedProposalInfo.pageInfo.firstCursor);
    }
  }, [isLoadingProposal, proposalQuery]);

  const pagination: Pagination = {
    hasPrevious: isPreviousProposalAvailable,
    hasNext: isNextProposalAvailable,
    onPrevious: showPreviousProposal,
    onNext: showNextProposal,
  };
  if (!currentProposal) {
    return null;
  }

  return (
    <Proposal
      pagination={pagination}
      isLoading={isLoadingProposal}
      proposalDetails={currentProposal}
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
