import { SubscriptionsManagement } from 'application/trading-copilot';

import { SettingsLayout } from '../../components';

export const TradingCopilotView = () => {
  return (
    <SettingsLayout>
      <SettingsLayout.Header />
      <SettingsLayout.Body>
        <SubscriptionsManagement />
      </SettingsLayout.Body>
    </SettingsLayout>
  );
};
