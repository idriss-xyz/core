import {
  BrowserClient,
  createTransport,
  defaultStackParser,
  Scope,
  extraErrorDataIntegration,
  makeFetchTransport,
  getDefaultIntegrations,
} from '@sentry/browser';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { SendToSentryCommand } from './commands';

const OBJ_DEPTH = 10;

type SentryExecutionEnvironment = 'injected-app' | 'service-worker';

const integrations = getDefaultIntegrations({}).filter((defaultIntegration) => {
  return !['BrowserApiErrors', 'Breadcrumbs', 'GlobalHandlers'].includes(
    defaultIntegration.name,
  );
});

const createClient = (
  executionEnvironment: SentryExecutionEnvironment,
  extensionId: string,
) => {
  return new BrowserClient({
    dsn: process.env.SENTRY_DSN,
    enabled: process.env.SENTRY_ENVIRONMENT === 'production',
    allowUrls: [
      `chrome-extension://${extensionId}`,
      'twitter.com',
      'supercast.xyz',
      'warpcast.com',
      'x.com',
    ],
    transport:
      executionEnvironment === 'service-worker'
        ? makeFetchTransport
        : (options) => {
            return createTransport(options, async (request) => {
              const command = new SendToSentryCommand({
                url: options.url,
                body: request.body,
                headers: options.headers,
                fetchOptions: options.fetchOptions,
              });

              const { status, headers } = await command.send();

              return {
                statusCode: status,
                headers: {
                  'x-sentry-rate-limits': headers.get('X-Sentry-Rate-Limits'),
                  'retry-after': headers.get('Retry-After'),
                },
              };
            });
          },
    stackParser: defaultStackParser,
    environment: process.env.SENTRY_ENVIRONMENT,
    integrations: [
      ...integrations,
      extraErrorDataIntegration({ depth: OBJ_DEPTH }),
    ],

    tracesSampleRate: 0.1,
    normalizeDepth: OBJ_DEPTH + 1,
  });
};

export const createObservabilityScope = (
  executionEnvironment: SentryExecutionEnvironment,
  allowUrls: string,
) => {
  const client = createClient(executionEnvironment, allowUrls);
  const scope = new Scope();
  scope.setClient(client);

  scope.setContext('Environment', { execution: executionEnvironment });

  client.init();

  return scope;
};

export type ObservabilityScope = Scope;

type ObservabilityScopeContextValue = ObservabilityScope;
const ObservabilityScopeContext = createContext<
  ObservabilityScopeContextValue | undefined
>(undefined);

export const useObservabilityScope = () => {
  const context = useContext(ObservabilityScopeContext);
  if (!context) {
    throw new Error('Expected WithObservabilityScope');
  }

  return context;
};

interface Properties {
  children: ReactNode;
}
export const WithObservabilityScope = ({ children }: Properties) => {
  // injected script doesn't have access to chrome.runtime api so we need to inject extension id into script.id which we set before injecting script into html
  const extensionId =
    document.querySelector('[data-testid="idriss-injected-script"]')?.id ?? '';

  const scope = useMemo(() => {
    return createObservabilityScope('injected-app', extensionId);
  }, [extensionId]);

  useEffect(() => {
    const captureException = (event: ErrorEvent) => {
      scope.captureException(event.error);
    };
    self.addEventListener('error', captureException);

    return () => {
      self.removeEventListener('error', captureException);
    };
  }, [scope]);

  return (
    <ObservabilityScopeContext.Provider value={scope}>
      {children}
    </ObservabilityScopeContext.Provider>
  );
};
