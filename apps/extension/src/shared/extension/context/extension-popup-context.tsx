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
import { createContextHook, useNotification } from 'shared/ui';

import { POPUP_ROUTE, PopupRoute } from '../constants';

interface Properties {
  children: ReactNode;
}

interface ExtensionPopupContextValues {
  isVisible: boolean;
  navigate: (route: PopupRoute) => void;
  navigateBack: () => void;
  currentRoute: PopupRoute;
  hide: () => void;
  open: () => void;
  showNotification: (message: string) => void;
}

const ExtensionPopupContext = createContext<
  ExtensionPopupContextValues | undefined
>(undefined);

const InnerExtensionPopupProvider = ({ children }: Properties) => {
  const [isVisible, setIsVisible] = useState(false);
  const notification = useNotification();

  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message: string) => {
    notification.show(<span>{message}</span>, 'top-right');
  };

  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
        currentRoute: location.pathname as PopupRoute,
        navigate,
        navigateBack,
        hide,
        open,
        showNotification,
      }}
    >
      {children}
    </ExtensionPopupContext.Provider>
  );
};

export const ExtensionPopupProvider = ({ children }: Properties) => {
  return (
    <MemoryRouter initialEntries={[POPUP_ROUTE.PRODUCTS]}>
      <InnerExtensionPopupProvider>{children}</InnerExtensionPopupProvider>
    </MemoryRouter>
  );
};

export const useExtensionPopup = createContextHook(ExtensionPopupContext);
