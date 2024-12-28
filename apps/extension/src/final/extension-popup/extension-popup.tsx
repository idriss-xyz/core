import { Route, Routes } from 'react-router';
import { useState } from 'react';

import { Closable } from 'shared/ui';
import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';
import { SubscriptionsManagement } from 'application/trading-copilot';
import { LINES, LINES2 } from 'assets/images';

import {
  GovernanceSettings,
  MainSettings,
  OtherSettings,
  Products,
} from './views';
import {
  TopBar,
  Footer,
  PopupContentLayout,
  SettingsLayout,
  TradingCopilotLayout,
  TradingCopilotToasts,
  TradingCopilotDialogs,
} from './components';

export const ExtensionPopup = () => {
  const [activeDialogId, setActiveDialogId] = useState<string | null>(null);
  const extensionPopup = useExtensionPopup();

  if (!extensionPopup.isVisible) {
    return null;
  }

  const openDialog = (dialogId: string) => {
    setActiveDialogId(dialogId);
  };

  const closeDialog = () => {
    setActiveDialogId(null);
  };

  return (
    <>
      <Closable
        closeButtonClassName="hidden"
        onClose={extensionPopup.hide}
        className="fixed right-2 top-2 z-extensionPopup flex w-[460px] flex-col overflow-hidden p-0 shadow-lg"
        closeOnClickAway
      >
        <TopBar className="rounded-t-xl" />

        <Routes>
          <Route element={<PopupContentLayout backgroundImage={LINES} />}>
            <Route path={POPUP_ROUTE.PRODUCTS} element={<Products />} />
          </Route>
          <Route element={<PopupContentLayout backgroundImage={LINES2} />}>
            <Route element={<SettingsLayout />}>
              <Route path={POPUP_ROUTE.SETTINGS} element={<MainSettings />} />
              <Route
                path={POPUP_ROUTE.GOVERNANCE_SETTINGS}
                element={<GovernanceSettings />}
              />
              <Route
                path={POPUP_ROUTE.OTHER_SETTINGS}
                element={<OtherSettings />}
              />
            </Route>

            <Route element={<TradingCopilotLayout />}>
              <Route
                path={POPUP_ROUTE.TRADING_COPILOT}
                element={<SubscriptionsManagement />}
              />
            </Route>
          </Route>
        </Routes>

        <Footer className="z-1 rounded-b-xl" />
      </Closable>
      <TradingCopilotToasts openDialog={openDialog} />
      <TradingCopilotDialogs
        activeDialogId={activeDialogId}
        closeDialog={closeDialog}
      />
    </>
  );
};
