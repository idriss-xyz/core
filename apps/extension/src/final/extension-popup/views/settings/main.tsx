import { useCallback } from 'react';

import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import { Setting } from './components';
import { SETTING_NAME_TO_LABEL } from './constants';

export const MainSettings = () => {
  const popup = useExtensionPopup();

  const goToGovernanceSettings = useCallback(() => {
    popup.navigate(POPUP_ROUTE.GOVERNANCE_SETTINGS);
  }, [popup]);

  const goToOtherSettings = useCallback(() => {
    popup.navigate(POPUP_ROUTE.OTHER_SETTINGS);
  }, [popup]);

  return (
    <div>
      <Setting
        label={SETTING_NAME_TO_LABEL['idriss-send-enabled']}
        action={<Setting.Switch name="idriss-send-enabled" />}
      />

      <Setting
        label="Governance widget"
        action={<Setting.ArrowRightButton onClick={goToGovernanceSettings} />}
      />

      <Setting
        label={SETTING_NAME_TO_LABEL['polymarket-enabled']}
        action={<Setting.Switch name="polymarket-enabled" />}
      />

      <Setting
        label="More features"
        action={<Setting.ArrowRightButton onClick={goToOtherSettings} />}
      />
    </div>
  );
};
