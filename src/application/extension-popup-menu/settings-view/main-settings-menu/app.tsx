import { useWallet } from 'shared/web3';

import { SettingsView } from '../types';

import { MainSettingsMenuListItem } from './main-settings-menu-item';

interface MainSettingsMenuProperties {
  setCurrentView: (view: SettingsView) => void;
}
export const App = ({ setCurrentView }: MainSettingsMenuProperties) => {
  const { wallet, openConnectionModal, removeWalletInfo } = useWallet();

  return (
    <ul className="shrink-0 grow text-black">
      <MainSettingsMenuListItem
        prefixIconName="GearIcon"
        label="Customization"
        onClick={() => {
          setCurrentView('customization');
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
  );
};
