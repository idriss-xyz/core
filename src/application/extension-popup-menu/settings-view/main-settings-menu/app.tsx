import { useNavigate } from 'react-router-dom';

import { useWallet } from 'shared/web3';
import { EXTENSION_POPUP_MENU_ROUTES } from 'application/extension-popup-menu/app';
import { IconButton } from 'shared/ui';

import { MainSettingsMenuListItem } from './main-settings-menu-item';

export const App = () => {
  const { wallet, openConnectionModal, removeWalletInfo } = useWallet();
  const navigate = useNavigate();

  return (
    <div className="shrink-0 grow px-6 pb-2 text-black">
      <div className="relative flex justify-center whitespace-nowrap px-5 py-4 text-lg font-bold">
        <IconButton
          className="absolute left-0 text-black hover:text-green-500"
          iconProps={{ name: 'ArrowLeftIcon', size: 25 }}
          onClick={() => {
            navigate(EXTENSION_POPUP_MENU_ROUTES.HOME);
          }}
        />

        <span className="capitalize">Settings</span>
      </div>

      <ul className="shrink-0 grow text-black">
        <MainSettingsMenuListItem
          prefixIconName="GearIcon"
          label="Customization"
          onClick={() => {
            navigate(EXTENSION_POPUP_MENU_ROUTES.SETTINGS.CUSTOMIZATION);
          }}
          suffixIconName="ChevronRightIcon"
        />
        <MainSettingsMenuListItem
          prefixIconName="ChatBubbleIcon"
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
          prefixIconName={wallet ? 'ExitIcon' : 'EnterIcon'}
          label={wallet ? 'Log Out' : 'Log In'}
          onClick={wallet ? removeWalletInfo : openConnectionModal}
        />
      </ul>
    </div>
  );
};
