import { Route, Routes } from 'react-router';

import { Closable } from 'shared/ui';
import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';

import {
  TopBar,
  Footer,
  PopupContentLayout,
  SettingsLayout,
} from './components';
import {
  GovernanceSettings,
  MainSettings,
  OtherSettings,
  Products,
} from './views';

export const ExtensionPopup = () => {
  const extensionPopup = useExtensionPopup();

  if (!extensionPopup.isVisible) {
    return null;
  }
  return (
    <Closable
      closeButtonClassName="hidden"
      onClose={extensionPopup.hide}
      className="fixed right-2 top-2 z-extensionPopup flex w-[460px] flex-col overflow-hidden p-0 shadow-lg"
      closeOnClickAway
    >
      <TopBar className="rounded-t-xl" />

      <Routes>
        <Route element={<PopupContentLayout />}>
          <Route path={POPUP_ROUTE.PRODUCTS} element={<Products />} />

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
        </Route>
      </Routes>

      <Footer className="z-1 rounded-b-xl" />
    </Closable>
  );
};
