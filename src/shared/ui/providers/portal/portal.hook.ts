import { createContextHook } from 'shared/ui/utils';

import { PortalContext } from './portal.context';

export const usePortal = createContextHook(PortalContext);
