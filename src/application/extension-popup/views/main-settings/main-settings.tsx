import { useWallet } from 'shared/web3';
import { Icon, IconButton } from 'shared/ui';
import { EXTENSION_POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import { MainSettingsMenuListItem } from './main-settings-menu-item';

export const MainSettingsView = () => {
  const { wallet, openConnectionModal, removeWalletInfo } = useWallet();
  const extensionPopup = useExtensionPopup();

  return (
    <div className="shrink-0 grow px-6 pb-2 text-black">
      <div className="relative flex justify-center whitespace-nowrap px-5 py-4 text-lg font-bold">
        <IconButton
          className="absolute left-0 text-black hover:text-green-500"
          iconProps={{ name: 'ArrowLeftIcon', size: 25 }}
          onClick={() => {
            extensionPopup.navigate(EXTENSION_POPUP_ROUTE.HOME);
          }}
        />

        <span className="capitalize">Settings</span>
      </div>

      <ul className="shrink-0 grow text-black">
        <MainSettingsMenuListItem
          prefix={<Icon name="GearIcon" size={20} />}
          label="Customization"
          onClick={() => {
            extensionPopup.navigate(
              EXTENSION_POPUP_ROUTE.SETTINGS_CUSTOMIZATION,
            );
          }}
          suffix={<Icon name="ChevronRightIcon" size={20} />}
        />
        <MainSettingsMenuListItem
          prefix={<Icon name="ChatBubbleIcon" size={20} />}
          label={
            <a
              href="https://www.idriss.xyz/discord"
              target="_blank"
              rel="noreferrer"
            >
              Support
            </a>
          }
        />
        <MainSettingsMenuListItem
          prefix={<Icon name={wallet ? 'ExitIcon' : 'EnterIcon'} size={20} />}
          label={wallet ? 'Log Out' : 'Log In'}
          onClick={wallet ? removeWalletInfo : openConnectionModal}
        />
      </ul>
    </div>
  );
};
