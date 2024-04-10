import { createContext } from 'react';

import { ExtensionSettings } from '../extension.types';

export const ExtensionSettingsContext = createContext<
  ExtensionSettings | undefined
>(undefined);
