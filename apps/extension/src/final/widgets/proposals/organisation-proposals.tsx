import { useCallback, useEffect, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import { AgoraWidget } from 'application/agora';
import { SnapshotWidget } from 'application/snapshot';
import { TallyWidget } from 'application/tally';
import { classes } from 'shared/ui';
import { ErrorBoundary } from 'shared/observability';
import { AGORA_LOGO, SNAPSHOT_LOGO, TALLY_LOGO } from 'shared/web3';

import { usePrefetchProposals } from '../../hooks';
import { PostWidgetProposalData, ProposalSource } from '../../types';

interface Properties {
  widgetData: PostWidgetProposalData;
  onClose: () => void;
  className?: string;
}

const PROPOSAL_SOURCE_TO_COMPONENT = {
  snapshot: SnapshotWidget,
  tally: TallyWidget,
  agora: AgoraWidget,
};
const PROPOSAL_SOURCE_TO_IMG = {
  snapshot: SNAPSHOT_LOGO,
  tally: TALLY_LOGO,
  agora: AGORA_LOGO,
};

const PROPOSAL_SOURCE_TO_NAME = {
  snapshot: 'Snapshot',
  tally: 'Tally',
  agora: 'Agora',
};

const PROPOSAL_SOURCE_TO_CLASSES = {
  snapshot: {
    trigger: 'bg-[#2d2d2d] text-white',
  },
  tally: {
    trigger: 'bg-white text-black',
  },
  agora: {
    trigger: 'bg-white text-black',
  },
};

const Base = ({ widgetData, onClose, className }: Properties) => {
  const { isPrefetched, activeSources } = usePrefetchProposals({
    widgetData,
  });

  const userActiveProposalSources = widgetData.proposalsSources.filter(
    (source) => {
      return activeSources.includes(source);
    },
  );

  const firstSource = userActiveProposalSources[0];

  const [activeTab, setActiveTab] = useState<ProposalSource>();

  useEffect(() => {
    if (firstSource) {
      setActiveTab(firstSource);
    }
  }, [firstSource]);

  const [isVisible, setIsVisible] = useState(true);

  const changeTab = useCallback(
    (source: string) => {
      if (!widgetData.proposalsSources.includes(source)) {
        throw new Error(
          `Unexpected source: ${source}, expected one of: ${widgetData.proposalsSources.join(', ')}`,
        );
      }
      setActiveTab(source as ProposalSource);
    },
    [widgetData.proposalsSources],
  );

  const close = useCallback(() => {
    setIsVisible(false);
    onClose();
  }, [onClose]);

  const Component = useCallback(
    (properties: { source: ProposalSource; className?: string }) => {
      return PROPOSAL_SOURCE_TO_COMPONENT[properties.source]({
        officialName: widgetData.officialNames[properties.source] ?? '',
        onClose: close,
        username: widgetData.username,
        className: properties.className,
      });
    },
    [close, widgetData],
  );

  if (!isVisible || !isPrefetched || activeSources.length === 0) {
    return null;
  }

  if (activeSources.length === 1 && firstSource) {
    return (
      <div
        className={classes('absolute right-4 z-20 w-96', className)}
        style={{ top: widgetData.top }}
      >
        <Component source={firstSource} className="rounded-lg" />
      </div>
    );
  }

  return (
    <Tabs.Root
      className={classes('absolute right-4 z-20 w-96', className)}
      style={{ top: widgetData.top }}
      value={activeTab}
      onValueChange={changeTab}
    >
      <Tabs.List className="relative top-[2px] flex shrink-0 items-end">
        {userActiveProposalSources.map((source) => {
          const isActive = source === activeTab;
          const imageSource = PROPOSAL_SOURCE_TO_IMG[source];
          const sourceClassnames = PROPOSAL_SOURCE_TO_CLASSES[source];
          const sourceName = PROPOSAL_SOURCE_TO_NAME[source];

          return (
            <Tabs.Trigger
              className={classes(
                'relative flex h-[26px] w-[100px] items-center space-x-1.5 rounded-t-lg px-2 pt-1 text-xs font-bold',
                'transition-all duration-[85] ease-linear will-change-[transform,top]',
                !isActive &&
                  'top-[2px] -translate-x-[2px] scale-95 pb-[2px] brightness-[0.85]',
                sourceClassnames.trigger,
              )}
              key={source}
              value={source}
            >
              <img className="h-4" src={imageSource} />
              <div>{sourceName}</div>
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>
      {userActiveProposalSources.map((source) => {
        return (
          <Tabs.Content key={source} value={source}>
            <Component source={source} className="rounded-r-lg rounded-bl-lg" />
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
};

export const OrganisationProposals = (properties: Properties) => {
  return (
    <ErrorBoundary>
      <Base {...properties} />
    </ErrorBoundary>
  );
};
