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
      className="fixed right-6 top-6 z-[9999] flex size-[570px] flex-col overflow-hidden rounded-md bg-white p-0 shadow-lg"
    >
      <TopBar />

      <div className="max-h-[460px] grow overflow-y-auto bg-gray-100 [scrollbar-color:gray_#b7b7b7] [scrollbar-width:thin]">
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
