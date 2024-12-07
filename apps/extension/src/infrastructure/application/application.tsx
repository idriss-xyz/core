import { useMemo, createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { useLocationInfo, ExtensionPopup, Final } from 'final';
import { LookUpWalletAddress } from 'application/look-up-wallet-address';

import { Providers } from './providers';

export class Application {
  private constructor() {}

  static run() {
    bootstrap();
    Application.fixTrustedTypes();
  }

  /*
   * This fixes issue that occured on Gmail on stopped our extension working on gmail website
   */
  private static fixTrustedTypes() {
    try {
      if (
        'trustedTypes' in window &&
        typeof window.trustedTypes === 'object' &&
        window.trustedTypes !== null &&
        'createPolicy' in window.trustedTypes &&
        typeof window.trustedTypes.createPolicy === 'function'
      ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        window.trustedTypes.createPolicy('default', {
          createHTML: (v: string) => {
            return v;
          },
          createScriptURL: (v: string) => {
            return v;
          },
          createScript: (v: string) => {
            return v;
          },
        });
      }
    } catch {
      // we mute the error because it just means that the policy is already there
    }
  }
}

const bootstrap = () => {
  const root = document.createElement('div');
  const shadowRoot = root.attachShadow({ mode: 'open' });
  const reactRoot = createRoot(shadowRoot);
  reactRoot.render(createElement(ApplicationWithProviders));
  document.body.append(root);
};

const ApplicationWithProviders = () => {
  const { isTwitter } = useLocationInfo();

  const disabledWalletRdns = useMemo(() => {
    if (isTwitter) {
      return ['coinbase'];
    }
    return [];
  }, [isTwitter]);

  return (
    <Providers disabledWalletRdns={disabledWalletRdns}>
      <LookUpWalletAddress />
      <ExtensionPopup />
      <Final />
    </Providers>
  );
};
