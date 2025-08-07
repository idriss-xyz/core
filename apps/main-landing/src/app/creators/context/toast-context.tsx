'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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
  actionButtons?: (close: () => void) => ReactNode;
}

interface ToastContextValue {
  toast: (options: Omit<ToastData, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const toast = useCallback((options: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = {
      ...options,
      id,
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-[3vh] left-1/2 z-50 flex -translate-x-1/2 flex-col-reverse gap-3">
        {toasts.map((toastData) => (
          <Toast
            key={toastData.id}
            type={toastData.type}
            heading={toastData.heading}
            description={toastData.description}
            iconName={toastData.iconName}
            autoClose={toastData.autoClose}
            actionButtons={toastData.actionButtons}
            onClose={() => removeToast(toastData.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
