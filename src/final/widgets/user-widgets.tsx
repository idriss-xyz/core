import { ErrorBoundary } from 'shared/observability';
import { GitcoinDonationWidget } from 'application/gitcoin';
import { IdrissSendWidget } from 'application/idriss-send';

import { useUserWidgets } from '../hooks';

export const UserWidgets = () => {
  const { widgets } = useUserWidgets();

  return (
    <ErrorBoundary>
      {widgets.map((widget) => {
        const key = `${widget.username}-${widget.top}`;

        if (widget.type === 'gitcoin') {
          return <GitcoinDonationWidget key={key} widgetData={widget} />;
        }

        return <IdrissSendWidget key={key} widgetData={widget} />;
      })}
    </ErrorBoundary>
  );
};
