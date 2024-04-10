import { createContextHook } from 'shared/ui/utils';

import { ExtensionSettingsContext } from './settings.context';

export const useExtensionSettings = createContextHook(ExtensionSettingsContext);
