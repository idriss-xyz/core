import { ReactNode, createContext } from 'react';

import { createContextHook } from 'shared/ui';

import { useTwitterMarkets } from '../hooks';

type VisibleMarketsContextValue = {
  conditionId: string;
  top: number;
}[];

const VisibleMarketsContext = createContext<
  VisibleMarketsContextValue | undefined
>(undefined);

export const useVisibleMarkets = createContextHook(VisibleMarketsContext);

interface Properties {
  children: ReactNode;
}

export const TwitterVisibleMarketsProvider = ({ children }: Properties) => {
  const marketsQuery = useTwitterMarkets();

  return (
    <VisibleMarketsContext.Provider value={marketsQuery.data ?? []}>
      {children}
    </VisibleMarketsContext.Provider>
  );
};
