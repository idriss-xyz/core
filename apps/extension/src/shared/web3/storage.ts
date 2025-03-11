import { StoredWallet } from '@idriss-xyz/wallet-connect';

import { onWindowMessage } from 'shared/messaging';

type StoredToastSoundState = boolean | undefined;

type StoredSubscriptionsAmount = number | undefined;

interface StoredSolanaWallet {
  account: string;
  providerName: string;
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

export class SolanaWalletStorage {
  public static get(): Promise<StoredSolanaWallet | undefined> {
    return new Promise((resolve) => {
      window.postMessage({
        type: 'GET_SOLANA_WALLET',
      });

      onWindowMessage<StoredSolanaWallet | undefined>(
        'GET_SOLANA_WALLET_RESPONSE',
        (maybeWallet) => {
          resolve(maybeWallet);
        },
      );
    });
  }

  public static save(payload: StoredSolanaWallet) {
    window.postMessage({
      type: 'SAVE_SOLANA_WALLET',
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: 'CLEAR_SOLANA_WALLET',
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

export class ToastSoundStateStorage {
  public static get(): Promise<StoredToastSoundState> {
    return new Promise((resolve) => {
      window.postMessage({
        type: 'GET_TOAST_SOUND_STATE',
      });

      onWindowMessage<StoredToastSoundState>(
        'GET_TOAST_SOUND_STATE_RESPONSE',
        (maybeToastSoundState) => {
          resolve(maybeToastSoundState);
        },
      );
    });
  }

  public static save(payload: StoredToastSoundState) {
    window.postMessage({
      type: 'SAVE_TOAST_SOUND_STATE',
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: 'CLEAR_TOAST_SOUND_STATE',
    });
  }
}

export class SubscriptionsAmountStorage {
  public static save(payload: StoredSubscriptionsAmount) {
    window.postMessage({
      type: 'SAVE_SUBSCRIPTIONS_AMOUNT',
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: 'CLEAR_SUBSCRIPTIONS_AMOUNT',
    });
  }
}
