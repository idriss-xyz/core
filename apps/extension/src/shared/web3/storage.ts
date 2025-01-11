import { onWindowMessage } from 'shared/messaging';

import { Hex } from './types';

interface StoredWallet {
  account: Hex;
  providerRdns: string;
}

type StoredAuthToken = string | undefined;

export class WalletStorage {
  public static get(): Promise<StoredWallet | undefined> {
    return new Promise((resolve) => {
      window.postMessage({
        type: 'GET_WALLET',
      });

      onWindowMessage<StoredWallet | undefined>(
        'GET_WALLET_RESPONSE',
        (maybeWallet) => {
          resolve(maybeWallet);
        },
      );
    });
  }

  public static save(payload: StoredWallet) {
    window.postMessage({
      type: 'SAVE_WALLET',
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: 'CLEAR_WALLET',
    });
  }
}

export class AuthTokenStorage {
  public static get(): Promise<StoredAuthToken> {
    return new Promise((resolve) => {
      window.postMessage({
        type: 'GET_AUTH_TOKEN',
      });

      onWindowMessage<StoredAuthToken>(
        'GET_AUTH_TOKEN_RESPONSE',
        (maybeAuthToken) => {
          resolve(maybeAuthToken);
        },
      );
    });
  }

  public static save(payload: StoredAuthToken) {
    window.postMessage({
      type: 'SAVE_AUTH_TOKEN',
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: 'CLEAR_AUTH_TOKEN',
    });
  }
}
