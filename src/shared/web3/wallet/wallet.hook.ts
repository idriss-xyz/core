import { createContextHook } from 'shared/ui/utils';

import { WalletContext } from './wallet.context';

export const useWallet = createContextHook(WalletContext);
