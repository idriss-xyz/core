import { Route, Routes } from 'react-router';

import { EXTENSION_POPUP_ROUTE, useExtensionPopup } from 'shared/extension';
import { Closable, ScrollArea } from 'shared/ui';

import { Footer, TopBar } from './components';
import { HomeView, MainSettingsView, CustomizationSettingsView } from './views';

export const ExtensionPopup = () => {
  const extensionPopup = useExtensionPopup();

  if (!extensionPopup.isVisible) {
    return null;
  }
  return (
    <Closable
      closeButtonClassName="hidden"
      closeOnClickAway
      onClose={extensionPopup.hide}
      // TODO: z-popup
      className="fixed right-2 top-2 z-[999999] flex h-[512px] w-[470px] flex-col overflow-hidden rounded-md bg-white p-0 shadow-lg"
    >
      <TopBar />
      <ScrollArea className="grow overflow-y-auto bg-gray-100">
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
      </ScrollArea>

      <Footer />
    </Closable>
  );
};
