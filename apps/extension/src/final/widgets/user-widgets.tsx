import { ErrorBoundary } from 'shared/observability';
import { IdrissSendWidget } from 'application/idriss-send';

import { useUserWidgets } from '../hooks';

export const UserWidgets = () => {
  const { widgets } = useUserWidgets();

  return (
    <ErrorBoundary>
      {widgets.map((widget) => {

        return (
          <div key={widget.nodeId}>
            <IdrissSendWidget widgetData={widget} />
          </div>
        );
      })}
    </ErrorBoundary>
  );
};
