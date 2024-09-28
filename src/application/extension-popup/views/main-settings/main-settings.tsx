import { useCallback } from 'react';

import { useWallet } from 'shared/web3';
import { Icon } from 'shared/ui';
import { EXTENSION_POPUP_ROUTE, useExtensionPopup } from 'shared/extension';
import { IDRISS_DISCORD_URL } from 'shared/idriss';

import { SettingsLayout } from '../../components';

import { MenuItem } from './main-settings-menu-item';

export const MainSettingsView = () => {
  const { wallet, openConnectionModal, removeWalletInfo } = useWallet();
  const extensionPopup = useExtensionPopup();

  const goToSettingsCustomization = useCallback(() => {
    extensionPopup.navigate(EXTENSION_POPUP_ROUTE.SETTINGS_CUSTOMIZATION);
  }, [extensionPopup]);

  const goToIdrissDiscord = useCallback(() => {
    window.open(IDRISS_DISCORD_URL, '_blank');
  }, []);

  return (
    <SettingsLayout>
      <SettingsLayout.Header title="Settings" />

      <SettingsLayout.Body>
        <ul className="text-black">
          <MenuItem
            prefix={<Icon name="GearIcon" size={20} />}
            label="Customization"
            suffix={<Icon name="ChevronRightIcon" size={20} />}
            onClick={goToSettingsCustomization}
          />
          <MenuItem
            prefix={<Icon name="ChatBubbleIcon" size={20} />}
            label="Support"
            onClick={goToIdrissDiscord}
          />
          <MenuItem
            prefix={<Icon name={wallet ? 'ExitIcon' : 'EnterIcon'} size={20} />}
            label={wallet ? 'Log Out' : 'Log In'}
            onClick={wallet ? removeWalletInfo : openConnectionModal}
          />
        </ul>
      </SettingsLayout.Body>
    </SettingsLayout>
  );
};
