import { ErrorBoundary } from 'shared/observability';
import { GitcoinDonationWidget } from 'application/gitcoin';
import { IdrissSendWidget } from 'application/idriss-send';

import { useUserWidgets } from '../hooks';

export const UserWidgets = () => {
  const { widgets } = useUserWidgets();

  return (
    <ErrorBoundary>
      {widgets.map((widget) => {
        if (widget.type === 'gitcoin') {
          return (
            <GitcoinDonationWidget key={widget.nodeId} widgetData={widget} />
          );
        }

        return <IdrissSendWidget key={widget.nodeId} widgetData={widget} />;
      })}
    </ErrorBoundary>
  );
};
