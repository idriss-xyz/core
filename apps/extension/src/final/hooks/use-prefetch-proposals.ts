import { useMemo } from 'react';

import { useAgoraProposalsQuery } from 'application/agora';
import { useTallyProposalsQuery } from 'application/tally';
import { useExtensionSettings } from 'shared/extension';

import { PostWidgetProposalData, ProposalSource } from '../types';

import { useApplicationStatus } from './use-application-status';

interface Properties {
  widgetData: PostWidgetProposalData;
}

/** Hook used to prefetch internal queries of proposals sources.
 * It is used to postpone rendering until we have initial data so there is no waiting time when switching tab. */
export const usePrefetchProposals = ({ widgetData }: Properties) => {
  const applicationsStatus = useApplicationStatus();
  const { extensionSettings } = useExtensionSettings();

  const agoraEnabled =
    applicationsStatus.agora &&
    widgetData.proposalsSources.includes('agora') &&
    extensionSettings['agora-enabled'];

  const agoraProposalsQuery = useAgoraProposalsQuery({
    offset: 0,
    enabled: agoraEnabled,
  });

  const tallyEnabled =
    applicationsStatus.tally &&
    widgetData.proposalsSources.includes('tally') &&
    extensionSettings['tally-enabled'];

  const tallyProposalsQuery = useTallyProposalsQuery({
    afterCursor: null,
    username: widgetData.username,
    enabled: tallyEnabled,
  });

  const isAgoraProposalPrefetched =
    !agoraProposalsQuery.isLoading && !agoraProposalsQuery.isPlaceholderData;

  const isTallyProposalPrefetched =
    !tallyProposalsQuery.isLoading && !tallyProposalsQuery.isPlaceholderData;

  const isPrefetched = isAgoraProposalPrefetched && isTallyProposalPrefetched;

  const hasAgoraProposal = Boolean(agoraProposalsQuery.data?.proposal);
  const hasTallyProposal = Boolean(tallyProposalsQuery.data?.nodes[0]);

  const activeSources = useMemo(() => {
    const sources: ProposalSource[] = [];

    if (hasAgoraProposal && agoraEnabled) {
      sources.push('agora');
    }

    if (hasTallyProposal && tallyEnabled) {
      sources.push('tally');
    }

    return sources;
  }, [agoraEnabled, hasAgoraProposal, hasTallyProposal, tallyEnabled]);

  return {
    isPrefetched,
    activeSources,
  };
};
