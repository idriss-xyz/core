import { createContext, ReactNode, useMemo } from 'react';

import { createContextHook } from '../utils';

type ExtensionInfo = {
  id: string;
};

const ExtensionInfoContext = createContext<ExtensionInfo | undefined>(
  undefined,
);

export const useExtensionInfo = createContextHook(ExtensionInfoContext);

interface Properties {
  children: ReactNode;
}

export const WithExtensionInfo = ({ children }: Properties) => {
  const contextValue = useMemo(() => {
    const extensionScript: HTMLElement | null = document.querySelector(
      '#idriss-extension-script',
    ); // TODO: constant

    return { id: extensionScript?.dataset.idrissExtensionId ?? '' };
  }, []);

  return (
    <ExtensionInfoContext.Provider value={contextValue}>
      {children}
    </ExtensionInfoContext.Provider>
  );
};
