import { createContextHook } from 'shared/ui/utils';

import { TwitterPageContext } from './page.context';

export const useTwitterPage = createContextHook(TwitterPageContext);
