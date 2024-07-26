import React, { createContext, useState, ReactNode, useCallback } from 'react';

import { createContextHook } from '../utils';

interface WidgetTabsContextType {
  preferredTab: Record<string, string | undefined>;
  tabs: Record<string, string[] | null>;
  setUserPreferredTab: (userHandle: string, tab: string | undefined) => void;
  addWidgetTab: (userHandle: string, tab: string) => void;
  removeAllUserWidgets: (userHandle: string) => void;
}

const WidgetTabsContext = createContext<WidgetTabsContextType | null>(null);

export const WidgetTabsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tabs, setTabs] = useState<Record<string, string[] | null>>({});

  const [preferredTab, setPreferredTab] = useState<
    Record<string, string | undefined>
  >({});

  const setUserPreferredTab = useCallback(
    (userHandle: string, tab: string | undefined) => {
      setPreferredTab((previous) => {
        return {
          ...previous,
          [userHandle]: tab,
        };
      });
    },
    [],
  );

  const addWidgetTab = useCallback((userHandle: string, tab: string) => {
    setTabs((previous) => {
      const givenUserTabs = previous[userHandle] ?? [];
      if (givenUserTabs.includes(tab)) {
        return previous;
      }

      return {
        ...previous,
        [userHandle]: [...givenUserTabs, tab].sort(),
      };
    });

    setPreferredTab((previous) => {
      if (previous[userHandle] === undefined) {
        return {
          ...previous,
          [userHandle]: tab,
        };
      }
      return previous;
    });
  }, []);

  const removeAllUserWidgets = useCallback((userHandle: string) => {
    setTabs((previous) => {
      const givenUserTabs = previous[userHandle];
      if (!givenUserTabs) {
        return previous;
      }
      return {
        ...previous,
        [userHandle]: null,
      };
    });

    setPreferredTab((previous) => {
      return {
        ...previous,
        [userHandle]: undefined,
      };
    });
  }, []);

  return (
    <WidgetTabsContext.Provider
      value={{
        preferredTab,
        tabs,
        setUserPreferredTab,
        addWidgetTab,
        removeAllUserWidgets,
      }}
    >
      {children}
    </WidgetTabsContext.Provider>
  );
};

export const useWidgetTabs = createContextHook(WidgetTabsContext);
