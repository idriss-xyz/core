import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import debounce from 'lodash/debounce';
import { MemoryRouter, useLocation, useNavigate } from 'react-router';

import {
  onWindowMessage,
  TOGGLE_EXTENSION_POPUP_VISIBILITY,
} from 'shared/messaging';
import { createContextHook } from 'shared/ui';

import { EXTENSION_POPUP_ROUTE } from './constants';

interface Properties {
  children: ReactNode;
}

type ExtensionPopupRoute =
  (typeof EXTENSION_POPUP_ROUTE)[keyof typeof EXTENSION_POPUP_ROUTE];

interface ExtensionPopupContextValues {
  isVisible: boolean;
  navigate: (route: ExtensionPopupRoute) => void;
  currentRoute: ExtensionPopupRoute;
  hide: () => void;
  open: () => void;
}

const ExtensionPopupContext = createContext<
  ExtensionPopupContextValues | undefined
>(undefined);

const InnerExtensionPopupProvider = ({ children }: Properties) => {
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleVisibility = useCallback(
    debounce(() => {
      setIsVisible((previous) => {
        return !previous;
      });
    }, 50),
    [],
  );

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    onWindowMessage(TOGGLE_EXTENSION_POPUP_VISIBILITY, () => {
      toggleVisibility();
    });
  }, [toggleVisibility]);

  // Clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      toggleVisibility.cancel();
    };
  }, [toggleVisibility]);

  return (
    <ExtensionPopupContext.Provider
      value={{
        isVisible,
        currentRoute: location.pathname,
        navigate,
        hide,
        open,
      }}
    >
      {children}
    </ExtensionPopupContext.Provider>
  );
};

export const ExtensionPopupProvider = ({ children }: Properties) => {
  return (
    <MemoryRouter>
      <InnerExtensionPopupProvider>{children}</InnerExtensionPopupProvider>
    </MemoryRouter>
  );
};

export const useExtensionPopup = createContextHook(ExtensionPopupContext);
