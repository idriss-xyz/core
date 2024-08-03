import { useCallback, useState } from 'react';

import { ErrorBoundary } from 'shared/observability';
import { useCommandQuery } from 'shared/messaging';
import { Pagination } from 'shared/ui';

import { useTwitterAgoraWidgetsInfo } from '../hooks';
import { GetAgoraProposalsCommand } from '../commands';

import { Proposal } from './proposal';

export const ProposalMainContainer = () => {
  const [hiddenAgoraUsers, setHiddenAgoraUsers] = useState<string[]>([]);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  const { visibleAgoraWidgetsInfo: visibleAgoraNodes } =
    useTwitterAgoraWidgetsInfo({
      hidden: hiddenAgoraUsers,
    });

  const hideAgoraUser = useCallback((agoraUsername: string) => {
    setHiddenAgoraUsers((previous) => {
      return [...previous, agoraUsername];
    });
  }, []);

  const proposalQuery = useCommandQuery({
    command: new GetAgoraProposalsCommand({
      offset: currentProposalIndex,
    }),
    enabled: visibleAgoraNodes ? visibleAgoraNodes.length > 0 : false,
    staleTime: Number.POSITIVE_INFINITY,
    placeholderData: (previousData) => {
      return previousData;
    },
  });

  const currentProposal = proposalQuery.data?.proposal;
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

  if (!currentProposal || !visibleAgoraNodes?.length) {
    return null;
  }

  return visibleAgoraNodes.map(({ top, twitterHandle }) => {
    return (
      <ErrorBoundary
        key={`${currentProposal?.id}at_${top}`}
        exceptionEventName="agora-widget-twitter-main-runtime-error"
      >
        <Proposal
          userHandle={twitterHandle}
          pagination={pagination}
          isLoading={isLoadingProposal}
          data={currentProposal}
          className="absolute"
          top={top - 12}
          onClose={() => {
            hideAgoraUser(currentProposal.proposer);
          }}
        />
      </ErrorBoundary>
    );
  });
};
