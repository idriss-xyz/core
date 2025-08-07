'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { Toast } from '@idriss-xyz/ui/toast';
import { IconName } from '@idriss-xyz/ui/icon';

type ToastType = 'default' | 'success' | 'error';

interface ToastData {
  id: string;
  type: ToastType;
  heading: string;
  description?: string;
  iconName?: IconName;
  autoClose?: boolean;
  closable?: boolean;
  actionButtons?: (close: () => void) => ReactNode;
}

interface ToastContextValue {
  toast: (options: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProperties {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProperties) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((options: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast: ToastData = {
      ...options,
      id,
    };

    setToasts((previous) => {
      return [...previous, newToast];
    });
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((previous) => {
      return previous.filter((toast) => {
        return toast.id !== id;
      });
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-0 left-1/2 z-alert flex flex-col-reverse gap-3 py-3">
        {toasts.map((toastData) => {
          return (
            <Toast
              key={toastData.id}
              type={toastData.type}
              heading={toastData.heading}
              description={toastData.description}
              iconName={toastData.iconName}
              autoClose={toastData.autoClose}
              actionButtons={toastData.actionButtons}
              onClose={() => {
                return removeToast(toastData.id);
              }}
            />
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
