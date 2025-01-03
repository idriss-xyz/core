import groupBy from 'lodash/groupBy';
import { v4 as uuidv4 } from 'uuid';
import {
  createContext,
  useState,
  useCallback,
  useMemo,
  ReactElement,
} from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { classes, createContextHook } from '../utils';

type Position = 'top-right' | 'bottom-right';

interface NotificationContextType {
  show: (body: ReactElement, position?: Position, id?: string) => void;
}

interface NotificationProperties {
  body: ReactElement;
  position: Position;
  uuid: string;
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
  onRemove: (uuid: string) => void;
  className?: string;
}) => {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <ToastPrimitive.Provider>
      {notifications.map((notification, index) => {
        return (
          <ToastPrimitive.Root
            duration={Infinity}
            key={notification.uuid}
            onOpenChange={(open) => {
              if (!open) {
                setTimeout(() => {
                  onRemove(notification.uuid);
                }, 150);
              }
            }}
            className={`absolute bottom-3 right-3 grid w-[460px] grid-cols-[1fr,36px] items-start gap-4 rounded-xl border border-neutral-300 bg-white p-4 transition-all ease-in [&[data-state="closed"]]:animate-[swipeRight_100ms_ease-in_forwards] [&[data-state="open"]]:animate-[swipeLeft_100ms_ease-out_forwards]`}
            style={{
              transform: `scale(${1 - index * 0.1}, 1) translateY(${(notification.position === 'top-right' ? 1 : -1) * ((notification.position === 'top-right' ? 100 : 0) + index * 3)}%)`,
              opacity: 1 - index * 0.25,
              transitionDuration: `${70 + index * 70}ms`,
              zIndex: 10 - index,
            }}
          >
            <div>
              <ToastPrimitive.Title className="text-sm font-medium text-white">
                {notification.body}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="text-sm text-[#6b7280]" />
            </div>
            <ToastPrimitive.Action
              asChild
              altText="Close notification"
              className="-translate-y-2 translate-x-2 p-2"
            >
              <IconButton intent="tertiary" size="medium" iconName="X" />
            </ToastPrimitive.Action>
          </ToastPrimitive.Root>
        );
      })}
      <ToastPrimitive.Viewport
        className={classes(
          'fixed z-notification flex flex-col gap-3 outline-none',
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
      // TODO: Check that after connecting to the websocket, does we need to check the ID to avoid duplicated notifications
      if (
        previous.some((previousToast) => {
          return previousToast.uuid === toast.uuid;
        })
      ) {
        return previous;
      }

      return [...previous, toast];
    });
  }, []);

  const handleRemoveToast = useCallback((uuid: string) => {
    setNotifications((previous) => {
      return previous.filter((existingToast) => {
        return existingToast.uuid !== uuid;
      });
    });
  }, []);

  const handleDispatchNotification = useCallback(
    (body: ReactElement, position: Position = defaultPosition, id?: string) => {
      return handleAddToast({
        body,
        position,
        uuid: id ?? uuidv4(),
      });
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
                    notifications={
                      notificationsByPosition[position]?.slice(0, 5) ?? []
                    }
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

const useNotification = createContextHook(NotificationContext);

export { NotificationsProvider, useNotification };
