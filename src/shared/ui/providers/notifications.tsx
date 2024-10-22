import groupBy from 'lodash/groupBy';
import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  ReactElement,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { Cross2Icon } from '@radix-ui/react-icons';

import { classes } from '../utils';

type Position = 'top-right' | 'bottom-right';

interface NotificationContextType {
  show: (body: ReactElement, position?: Position) => void;
}

interface NotificationProperties {
  body: ReactElement;
  position: Position;
  timestamp: number;
}

interface NotificationsProperties {
  className?: string;
  children: React.ReactElement;
  defaultPosition?: Position;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const getPositionClasses = (position: Position) => {
  switch (position) {
    case 'top-right': {
      return 'top-0 right-0';
    }
    case 'bottom-right': {
      return 'bottom-0 right-0';
    }
  }
};

const NotificationViewport = ({
  position,
  notifications,
  onRemove,
  className,
}: {
  position: Position;
  notifications: NotificationProperties[];
  onRemove: (timestamp: number) => void;
  className?: string;
}) => {
  if (notifications.length === 0) return null;

  return (
    <ToastPrimitive.Provider>
      {notifications.map((notification) => {
        return (
          <ToastPrimitive.Root
            duration={Infinity}
            key={notification.timestamp}
            onOpenChange={(open) => {
              if (!open) {
                onRemove(notification.timestamp);
              }
            }}
            className="flex w-80 items-center justify-between rounded-lg bg-[#11dd74] p-4 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div>
                <ToastPrimitive.Title className="text-sm font-medium text-white">
                  {notification.body}
                </ToastPrimitive.Title>
                <ToastPrimitive.Description className="text-sm text-gray-500" />
              </div>
            </div>
            <ToastPrimitive.Close className="flex size-6 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300">
              <Cross2Icon />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport
        className={classes(
          'fixed z-[9999999] flex flex-col gap-4 p-6 outline-none',
          getPositionClasses(position),
          className,
        )}
      />
    </ToastPrimitive.Provider>
  );
};

const NotificationsProvider = ({
  className: positionClassName,
  children,
  defaultPosition = 'bottom-right',
}: NotificationsProperties) => {
  const [notifications, setNotifications] = useState<NotificationProperties[]>(
    [],
  );

  const handleAddToast = useCallback((toast: NotificationProperties) => {
    setNotifications((previous) => {
      return [...previous, toast];
    });
  }, []);

  const handleRemoveToast = useCallback((timestamp: number) => {
    setNotifications((previous) => {
      return previous.filter((existingToast) => {
        return existingToast.timestamp !== timestamp;
      });
    });
  }, []);

  const handleDispatchNotification = useCallback(
    (body: ReactElement, position: Position = defaultPosition) => {
      return handleAddToast({ body, position, timestamp: Date.now() });
    },
    [handleAddToast, defaultPosition],
  );

  const contextValue = useMemo(() => {
    return {
      show: handleDispatchNotification,
    };
  }, [handleDispatchNotification]);

  const notificationsByPosition = useMemo(() => {
    return groupBy<NotificationProperties>(notifications, (notification) => {
      return notification.position;
    });
  }, [notifications]);

  return (
    <NotificationContext.Provider value={contextValue}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <>
          {(Object.keys(notificationsByPosition) as Position[]).map(
            (position) => {
              return (
                <div
                  key={position}
                  className={classes(
                    'absolute flex flex-col gap-4',
                    getPositionClasses(position),
                  )}
                >
                  <NotificationViewport
                    position={position}
                    notifications={notificationsByPosition[position] ?? []}
                    onRemove={handleRemoveToast}
                    className={positionClassName}
                  />
                </div>
              );
            },
          )}
        </>
      </ToastPrimitive.Provider>
    </NotificationContext.Provider>
  );
};

function useNotification() {
  const context = useContext(NotificationContext);
  if (context) return context;
  throw new Error('useNotification must be used within NotificationsProvider');
}

export { NotificationsProvider, useNotification };