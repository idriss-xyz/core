import { useState } from 'react';

import { useExtensionSettings } from 'shared/extension';
import { Closable, IconButton, Toggle } from 'shared/ui';
import { IDRISS_ICON_WITH_TEXT } from 'shared/idriss';

import { HomeView } from './home-view';
import { SettingsView } from './settings-view';
import { Footer } from './footer';

export type MenuContent = 'home' | 'settings';

export const App = () => {
  const [activeView, setActiveView] = useState<MenuContent>('home');
  const {
    isContextMenuVisible,
    hideContextMenu,
    extensionSettings,
    changeExtensionSetting,
  } = useExtensionSettings();

  if (!isContextMenuVisible) {
    return null;
  }
  return (
    <Closable
      closeButtonClassName="hidden"
      closeOnClickAway
      onClose={hideContextMenu}
      className="fixed right-6 top-6 z-50 flex size-[400px] flex-col overflow-hidden rounded-md bg-white p-0"
    >
      <>
        <nav className="flex items-center justify-between bg-white drop-shadow-sm">
          <a
            href="https://www.idriss.xyz/"
            className="flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="my-2 ml-2 h-12 w-auto"
              src={IDRISS_ICON_WITH_TEXT}
              alt="IDriss Logo"
            />
          </a>
          <div className="flex items-center pr-2">
            <Toggle
              checked={extensionSettings['entire-extension-enabled']}
              onCheckedChange={(enabled) => {
                return changeExtensionSetting(
                  'entire-extension-enabled',
                  enabled,
                );
              }}
            />
            <IconButton
              className="text-black"
              iconProps={{
                name: activeView === 'home' ? 'DotsVerticalIcon' : 'Cross1Icon',
                size: 26,
              }}
              onClick={() => {
                setActiveView(activeView === 'home' ? 'settings' : 'home');
              }}
            />
          </div>
        </nav>

        {activeView === 'home' ? <HomeView /> : <SettingsView />}
      </>
      <Footer />
    </Closable>
  );
};
