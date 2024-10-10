import * as amplitude from '@amplitude/analytics-browser';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { onWindowMessage } from 'shared/messaging';

import { SendToAmplitudeCommand } from './commands';

const logViaCommand = (): amplitude.Types.EnrichmentPlugin => {
  return {
    type: 'enrichment',
    name: 'logViaCommand',
    execute: async (event) => {
      if (
        typeof event.event_properties === 'object' &&
        event.event_properties !== null &&
        'isIdriss' in event.event_properties
      ) {
        const { isIdriss, ...properties } = event.event_properties;
        const command = new SendToAmplitudeCommand({
          event: { ...event, event_properties: properties },
        });

        await command.send();

        return null; // drop the event from middleware chain so it is not send via webpage (would trigger CSP error or double event)
      }

      return null;
    },
  };
};

// amplitude expects local storage but we cannot rely on it
const storageProvider: amplitude.Types.Storage<amplitude.Types.Event[]> = {
  isEnabled: () => {
    return new Promise((resolve) => {
      return resolve(true);
    });
  },
  get: () => {
    return new Promise((resolve) => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return resolve(undefined);
    });
  },
  reset: () => {
    return new Promise((resolve) => {
      return resolve();
    });
  },
  set: () => {
    return new Promise((resolve) => {
      return resolve();
    });
  },
  getRaw: () => {
    return new Promise((resolve) => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return resolve(undefined);
    });
  },
  remove: () => {
    return new Promise((resolve) => {
      return resolve();
    });
  },
};

const createClient = () => {
  if (process.env.ENVIRONMENT !== 'production') {
    return;
  }

  const client = amplitude.createInstance();
  client.init(process.env.AMPLITUDE_API_KEY, {
    autocapture: false,
    storageProvider,
    logLevel: 0,
    identityStorage: 'none',
    trackingOptions: {
      language: false,
      platform: false,
      ipAddress: false,
    },
  });
  client.add(logViaCommand());
  return client;
};

type EventsLogger = {
  track: (
    eventName: string,
    properties?: Record<string, unknown>,
  ) => Promise<void>;
};

const EventsLoggerContext = createContext<EventsLogger | undefined>(undefined);

export const useEventsLogger = () => {
  const context = useContext(EventsLoggerContext);
  if (!context) {
    throw new Error('Expected WithEventsLogger');
  }

  return context;
};

type Properties = {
  children: ReactNode;
};

class DeviceIdStorage {
  public static get(): Promise<string | undefined> {
    return new Promise((resolve) => {
      window.postMessage({
        type: 'GET_DEVICE_ID',
      });

      onWindowMessage<string | undefined>(
        'GET_DEVICE_ID_RESPONSE',
        (maybeWallet) => {
          resolve(maybeWallet);
        },
      );
    });
  }

  public static set(payload: string) {
    window.postMessage({
      type: 'SET_DEVICE_ID',
      detail: payload,
    });
  }
}

export const WithEventsLogger = ({ children }: Properties) => {
  const client = useMemo(() => {
    return createClient();
  }, []);

  const logger = useMemo(() => {
    return {
      track: async (
        eventName: string,
        properties?: Record<string, unknown>,
      ) => {
        await client?.track(eventName, { ...properties, isIdriss: true })
          .promise;
      },
    };
  }, [client]);

  // syncs deviceId across different domains so if user has few tabs opened each tab is considered as same user
  const syncDeviceId = useCallback(async () => {
    const maybeDeviceId = await DeviceIdStorage.get();
    if (maybeDeviceId) {
      client?.setDeviceId(maybeDeviceId);
      return;
    }

    const currentDeviceId = client?.getDeviceId();
    if (currentDeviceId) {
      DeviceIdStorage.set(currentDeviceId);
    }
  }, [client]);

  useEffect(() => {
    void syncDeviceId();
  }, [syncDeviceId]);

  return (
    <EventsLoggerContext.Provider value={logger}>
      {children}
    </EventsLoggerContext.Provider>
  );
};
