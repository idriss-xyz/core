import { createContext } from 'react';

import { TwitterPage, UnknownPage } from '../twitter.types';

export const TwitterPageContext = createContext<
  TwitterPage | UnknownPage | undefined
>(undefined);
