import { ErrorBoundary } from 'shared/observability';
import { GitcoinDonationWidget } from 'application/gitcoin';
import { IdrissSendWidget } from 'application/idriss-send';

import { useAddressResolver, useUserWidgets } from '../hooks';

export const UserWidgets = () => {
  const { widgets } = useUserWidgets();

  const addressResolver = useAddressResolver();

  return (
    <ErrorBoundary>
      {widgets.map((widget) => {
        const key = `${widget.username}-${widget.top}`;

        if (widget.type === 'gitcoin') {
          return <GitcoinDonationWidget key={key} widgetData={widget} />;
        }

        return (
          <IdrissSendWidget
            key={key}
            widgetData={widget}
            addressResolver={addressResolver}
          />
        );
      })}
    </ErrorBoundary>
  );
};
