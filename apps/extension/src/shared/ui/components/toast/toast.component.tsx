import * as RadixToast from '@radix-ui/react-toast';

import { ToastProperties } from './toast.types';

export const ToastComponent = ({ children }: ToastProperties) => {
  return (
    <RadixToast.Provider swipeDirection="right">
      {children}
      <RadixToast.Viewport className="fixed bottom-3 right-3 flex w-[460px] flex-col gap-y-3 overflow-hidden shadow-sm" />
    </RadixToast.Provider>
  );
};
