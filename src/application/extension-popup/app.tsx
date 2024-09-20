import { Route, Routes } from 'react-router-dom';

import { EXTENSION_POPUP_ROUTE, useExtensionSettings } from 'shared/extension';
import { Closable } from 'shared/ui';

import { Footer } from './footer';
import { PopupHomeView } from './popup-home-view';
import { TopBar } from './top-bar';
import { CustomizationSettings, MainSettingsMenu } from './settings-view';

export const App = () => {
  const { isPopupVisible, hidePopup } = useExtensionSettings();

  if (!isPopupVisible) {
    return null;
  }
  return (
    <Closable
      closeButtonClassName="hidden"
      closeOnClickAway
      onClose={hidePopup}
      className="fixed right-2 top-2 z-[9999] flex w-[470px] h-[513px] flex-col overflow-hidden rounded-md bg-white p-0 shadow-lg"
    >
      <TopBar />

      <div className="max-w-[470px] grow overflow-y-auto bg-gray-100 [scrollbar-color:gray_#b7b7b7] [scrollbar-width:thin]">
        <Routes>
          <Route
            path={EXTENSION_POPUP_ROUTE.HOME}
            element={<PopupHomeView />}
          />
          <Route
            path={EXTENSION_POPUP_ROUTE.SETTINGS_HOME}
            element={<MainSettingsMenu />}
          />
          <Route
            path={EXTENSION_POPUP_ROUTE.SETTINGS_CUSTOMIZATION}
            element={<CustomizationSettings />}
          />
        </Routes>
      </div>

      <Footer />
    </Closable>
  );
};
