import { Route, Routes } from 'react-router';

import { EXTENSION_POPUP_ROUTE, useExtensionPopup } from 'shared/extension';
import { Closable } from 'shared/ui';

import { Footer, TopBar } from './components';
import { HomeView } from './views/home/home';
import { MainSettingsView } from './views/main-settings/main-settings';
import { CustomizationSettingsView } from './views/customization-settings/customization-settings';

export const App = () => {
  const extensionPopup = useExtensionPopup();

  if (!extensionPopup.isVisible) {
    return null;
  }
  return (
    <Closable
      closeButtonClassName="hidden"
      closeOnClickAway
      onClose={extensionPopup.hide}
      className="fixed right-6 top-6 z-[9999] flex size-[570px] flex-col overflow-hidden rounded-md bg-white p-0 shadow-lg"
    >
      <TopBar />

      <div className="max-h-[460px] grow overflow-y-auto bg-gray-100 [scrollbar-color:gray_#b7b7b7] [scrollbar-width:thin]">
        <Routes>
          <Route path={EXTENSION_POPUP_ROUTE.HOME} element={<HomeView />} />
          <Route
            path={EXTENSION_POPUP_ROUTE.SETTINGS_HOME}
            element={<MainSettingsView />}
          />
          <Route
            path={EXTENSION_POPUP_ROUTE.SETTINGS_CUSTOMIZATION}
            element={<CustomizationSettingsView />}
          />
        </Routes>
      </div>

      <Footer />
    </Closable>
  );
};
