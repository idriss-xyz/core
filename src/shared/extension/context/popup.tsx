import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import debounce from 'lodash/debounce';

import {
  onWindowMessage,
  TOGGLE_EXTENSION_POPUP_VISIBILITY,
} from 'shared/messaging';
import { createContextHook } from 'shared/ui';

interface Properties {
  children: ReactNode;
}

interface ExtensionPopupContextValues {
  isVisible: boolean;
  hide: () => void;
  open: () => void;
}

const ExtensionPopupContext = createContext<
  ExtensionPopupContextValues | undefined
>(undefined);

export const ExtensionPopupProvider = ({ children }: Properties) => {
  const [isVisible, setIsVisible] = useState(false);

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
    onWindowMessage<void>(TOGGLE_EXTENSION_POPUP_VISIBILITY, () => {
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
        hide,
        open,
      }}
    >
      {children}
    </ExtensionPopupContext.Provider>
  );
};

export const useExtensionPopup = createContextHook(ExtensionPopupContext);
