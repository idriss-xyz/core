import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import { TooltipProvider } from '@idriss-xyz/ui/tooltip';

import { QueryProvider } from '@/providers';
import { ToastProvider } from './context/toast-context';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <TooltipProvider delayDuration={400}>
            <ToastProvider>
              {children}
            </ToastProvider>
          </TooltipProvider>
        </NiceModal.Provider>
      </WithPortal>
    </QueryProvider>
  );
};
