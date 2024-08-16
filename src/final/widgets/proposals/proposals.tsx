import { ErrorBoundary } from 'shared/observability';

import { useProposalsWidgets } from '../../hooks';

import { OrganisationProposals } from './organisation-proposals';

export const Proposals = () => {
  const { widgets, userPageProposalWidget, hideWidget } = useProposalsWidgets();

  return (
    <ErrorBoundary>
      {widgets.map((widget) => {
        const key = `${widget.username}-${widget.top}`;

        return (
          <OrganisationProposals
            key={key}
            widgetData={widget}
            onClose={() => {
              hideWidget(widget.username);
            }}
          />
        );
      })}

      {userPageProposalWidget ? (
        <OrganisationProposals
          widgetData={userPageProposalWidget}
          onClose={() => {
            hideWidget(userPageProposalWidget.username);
          }}
          className="fixed"
        />
      ) : null}
    </ErrorBoundary>
  );
};
