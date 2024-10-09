import { IDRISS_URL } from 'shared/idriss';
import { IDRISS_FULL_LOGO } from 'assets/images';
import { IconButton, Toggle } from 'shared/ui';
import {
  useExtensionSettings,
} from 'shared/extension';

import { useExtensionPopup } from '../extension-popup-context';
import { EXTENSION_POPUP_ROUTE } from '../constants';

export const TopBar = () => {
  const { extensionSettings, changeExtensionSetting } = useExtensionSettings();
  const extensionPopup = useExtensionPopup();

  const showSettingsButton =
    extensionPopup.currentRoute === EXTENSION_POPUP_ROUTE.HOME;

  return (
    <nav className="flex items-center justify-between bg-white p-2 drop-shadow-sm">
      <a
        href={IDRISS_URL}
        className="flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className="h-12" src={IDRISS_FULL_LOGO} alt="IDriss Logo" />
      </a>
      <div className="flex items-center">
        {showSettingsButton && (
          <IconButton
            className="text-black"
            iconProps={{
              name: 'DotsVerticalIcon',
              size: 24,
            }}
            onClick={() => {
              extensionPopup.navigate(EXTENSION_POPUP_ROUTE.SETTINGS_HOME);
            }}
          />
        )}
        <Toggle
          value={extensionSettings['entire-extension-enabled']}
          onChange={(enabled) => {
            return changeExtensionSetting({
              'entire-extension-enabled': enabled,
            });
          }}
        />
      </div>
    </nav>
  );
};
