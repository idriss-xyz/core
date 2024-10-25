import { Route, Routes } from 'react-router';

import { Closable, ScrollArea } from 'shared/ui';
import { EXTENSION_POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import { Footer, TopBar } from './components';
import { HomeView, MainSettingsView, CustomizationSettingsView } from './views';
import { TradingCopilotView } from './views/trading-copilot';

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
      <ScrollArea className="grow overflow-y-auto bg-[#F3F4F6]">
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
          <Route
            path={EXTENSION_POPUP_ROUTE.TRADING_COPILOT}
            element={<TradingCopilotView />}
          />
        </Routes>
      </ScrollArea>

      <Footer />
    </Closable>
  );
};
