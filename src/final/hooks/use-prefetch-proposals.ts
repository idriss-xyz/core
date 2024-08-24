import { useMemo } from 'react';

import { useAgoraProposalsQuery } from 'application/agora';
import { useSnapshotProposalsQuery } from 'application/snapshot';
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

  const snapshotEnabled =
    applicationsStatus.snapshot &&
    widgetData.proposalsSources.includes('snapshot') &&
    extensionSettings['snapshot-enabled'];

  const snapshotProposalsQuery = useSnapshotProposalsQuery({
    pageNumber: 0,
    enabled: snapshotEnabled,
    officialName: widgetData.officialNames.snapshot ?? '',
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

  const isPrefetched =
    !agoraProposalsQuery.isLoading &&
    !snapshotProposalsQuery.isLoading &&
    !tallyProposalsQuery.isLoading;

  const hasAgoraProposal = Boolean(agoraProposalsQuery.data?.proposal);
  const hasSnapshotProposal = Boolean(snapshotProposalsQuery.data?.proposal);
  const hasTallyProposal = Boolean(tallyProposalsQuery.data?.nodes[0]);

  const activeSources = useMemo(() => {
    const sources: ProposalSource[] = [];

    if (hasAgoraProposal && agoraEnabled) {
      sources.push('agora');
    }

    if (hasSnapshotProposal && snapshotEnabled) {
      sources.push('snapshot');
    }

    if (hasTallyProposal && tallyEnabled) {
      sources.push('tally');
    }

    return sources;
  }, [
    agoraEnabled,
    hasAgoraProposal,
    hasSnapshotProposal,
    hasTallyProposal,
    snapshotEnabled,
    tallyEnabled,
  ]);

  return {
    isPrefetched,
    activeSources,
  };
};
