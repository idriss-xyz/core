import { Context, useContext as useReactContext } from 'react';

const useContext = <T>(context: Context<T>) => {
  const contextValue = useReactContext(context);

  if (!contextValue) {
    throw new Error('Tried to use context outside provider');
  }

  return contextValue;
};

export const createContextHook = <T>(context: Context<T>) => {
  return () => {
    return useContext(context);
  };
};
