import { useMemo } from 'react';

import { useAgoraProposalsQuery } from 'application/agora';
import { useSnapshotProposalsQuery } from 'application/snapshot';
import { useTallyProposalsQuery } from 'application/tally';

import { PostWidgetProposalData, ProposalSource } from '../types';

import { useApplicationStatus } from './use-application-status';

interface Properties {
  widgetData: PostWidgetProposalData;
}

/** Hook used to prefetch internal queries of proposals sources.
 * It is used to postpone rendering until we have initial data so there is no waiting time when switching tab. */
export const usePrefetchProposals = ({ widgetData }: Properties) => {
  const applicationsStatus = useApplicationStatus();

  const agoraProposalsQuery = useAgoraProposalsQuery({
    offset: 0,
    enabled:
      applicationsStatus.agora && widgetData.proposalsSources.includes('agora'),
  });

  const snapshotProposalsQuery = useSnapshotProposalsQuery({
    pageNumber: 0,
    enabled:
      applicationsStatus.snapshot &&
      widgetData.proposalsSources.includes('snapshot'),
    officialName: widgetData.officialNames.snapshot ?? '',
  });

  const tallyProposalsQuery = useTallyProposalsQuery({
    afterCursor: null,
    username: widgetData.username,
    enabled:
      applicationsStatus.tally && widgetData.proposalsSources.includes('tally'),
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

    if (hasAgoraProposal) {
      sources.push('agora');
    }

    if (hasSnapshotProposal) {
      sources.push('snapshot');
    }

    if (hasTallyProposal) {
      sources.push('tally');
    }

    return sources;
  }, [hasAgoraProposal, hasSnapshotProposal, hasTallyProposal]);

  return {
    isPrefetched,
    activeSources,
  };
};
