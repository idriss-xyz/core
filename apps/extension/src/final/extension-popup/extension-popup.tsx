import { Route, Routes } from 'react-router';

import { Closable } from 'shared/ui';
import { POPUP_ROUTE, useExtensionPopup } from 'shared/extension';
import { LINES } from 'assets/images';

import {
  TopBar,
  Footer,
  PopupContentLayout,
} from './components';
import { Products } from './views';

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
        <Route element={<PopupContentLayout backgroundImage={LINES} />}>
          <Route path={POPUP_ROUTE.PRODUCTS} element={<Products />} />
        </Route>
      </Routes>

      <Footer className="z-1 rounded-b-xl" />
    </Closable>
  );
};
