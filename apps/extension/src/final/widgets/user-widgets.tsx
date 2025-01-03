import { ErrorBoundary } from 'shared/observability';
import { GitcoinDonationWidget } from 'application/gitcoin';
import { IdrissSendWidget } from 'application/idriss-send';

import { useLocationInfo, useUserWidgets } from '../hooks';

import { FollowTradingCopilotBadge } from './follow-trading-copilot';

export const UserWidgets = () => {
  const { widgets } = useUserWidgets();
  const { isTwitter } = useLocationInfo();

  return (
    <ErrorBoundary>
      {widgets.map((widget) => {
        if (widget.type === 'gitcoin') {
          return (
            <GitcoinDonationWidget key={widget.nodeId} widgetData={widget} />
          );
        }

        return (
          <div key={widget.nodeId}>
            <IdrissSendWidget widgetData={widget} />
            {isTwitter ? null : (
              <FollowTradingCopilotBadge
                node={widget.node}
                userId={widget.walletAddress}
                isHandleUser={widget.isHandleUser}
              />
            )}
          </div>
        );
      })}
    </ErrorBoundary>
  );
};
