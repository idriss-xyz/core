import { useCallback, useState } from 'react';

import { ErrorBoundary } from 'shared/monitoring';
import { useCommandQuery } from 'shared/messaging';

import { useTwitterVisibleAgoraNodes } from '../hooks';
import { GetAgoraProposalsCommand } from '../commands';

import { Proposal } from './proposal';

export const ProposalMainContainer = () => {
  const [hiddenAgoraUsers, setHiddenAgoraUsers] = useState<string[]>([]);
  const [currentProposalIndex, setCurrentProposalIndex] = useState(0);

  const { visibleAgoraNodes } = useTwitterVisibleAgoraNodes({
    hidden: hiddenAgoraUsers,
  });

  const hideAgoraUser = useCallback((agoraUsername: string) => {
    setHiddenAgoraUsers((previous) => {
      return [...previous, agoraUsername];
    });
  }, []);

  const proposalQuery = useCommandQuery({
    command: new GetAgoraProposalsCommand({
      limit: 1,
      offset: currentProposalIndex,
    }),
    enabled: visibleAgoraNodes ? visibleAgoraNodes.length > 0 : false,
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

  if (!currentProposal || !visibleAgoraNodes?.length) {
    return null;
  }

  return visibleAgoraNodes.map(({ top }) => {
    return (
      <ErrorBoundary
        key={`${currentProposal?.proposalId}at_${top}`}
        exceptionEventName="agora-widget-twitter-main-runtime-error"
      >
        <Proposal
          isPreviousProposalAvailable={isPreviousProposalAvailable}
          isNextProposalAvailable={isNextProposalAvailable}
          onNext={showNextProposal}
          onPrevious={showPreviousProposal}
          isLoading={isLoadingProposal}
          data={currentProposal}
          className="absolute"
          top={top - 12}
          onClose={() => {
            hideAgoraUser(currentProposal.proposerAddress);
          }}
        />
      </ErrorBoundary>
    );
  });
};
