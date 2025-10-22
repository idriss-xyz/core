import { useCallback } from 'react';

import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import { Setting } from './components';

export const MainSettings = () => {
  const popup = useExtensionPopup();

  const goToOtherSettings = useCallback(() => {
    popup.navigate(POPUP_ROUTE.OTHER_SETTINGS);
  }, [popup]);

  return (
    <div>
            <Setting
        label="More features"
        action={<Setting.ArrowRightButton onClick={goToOtherSettings} />}
      />
    </div>
  );
};
