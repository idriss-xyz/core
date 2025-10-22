import { StoredWallet } from '@idriss-xyz/wallet-connect';

import { StoredSubscriptions } from 'shared/extension';
import { onWindowMessage } from 'shared/messaging';

import {
  AuthTokenWindowMessages,
  SolanaWalletWindowMessages,
  WalletWindowMessages,
} from './messages';

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
        type: WalletWindowMessages.GET_WALLET,
      });

      onWindowMessage<StoredWallet | undefined>(
        WalletWindowMessages.GET_WALLET_RESPONSE,
        (maybeWallet) => {
          resolve(maybeWallet);
        },
      );
    });
  }

  public static save(payload: StoredWallet) {
    window.postMessage({
      type: WalletWindowMessages.SAVE_WALLET,
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: WalletWindowMessages.CLEAR_WALLET,
    });
  }
}

export class SolanaWalletStorage {
  public static get(): Promise<StoredSolanaWallet | undefined> {
    return new Promise((resolve) => {
      window.postMessage({
        type: SolanaWalletWindowMessages.GET_SOLANA_WALLET,
      });

      onWindowMessage<StoredSolanaWallet | undefined>(
        SolanaWalletWindowMessages.GET_SOLANA_WALLET_RESPONSE,
        (maybeWallet) => {
          resolve(maybeWallet);
        },
      );
    });
  }

  public static save(payload: StoredSolanaWallet) {
    window.postMessage({
      type: SolanaWalletWindowMessages.SAVE_SOLANA_WALLET,
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: SolanaWalletWindowMessages.CLEAR_SOLANA_WALLET,
    });
  }
}

export class AuthTokenStorage {
  public static get(): Promise<StoredAuthToken> {
    return new Promise((resolve) => {
      window.postMessage({
        type: AuthTokenWindowMessages.GET_AUTH_TOKEN,
      });

      onWindowMessage<StoredAuthToken>(
        AuthTokenWindowMessages.GET_AUTH_TOKEN_RESPONSE,
        (maybeAuthToken) => {
          resolve(maybeAuthToken);
        },
      );
    });
  }

  public static save(payload: StoredAuthToken) {
    window.postMessage({
      type: AuthTokenWindowMessages.SAVE_AUTH_TOKEN,
      detail: payload,
    });
  }

  public static clear() {
    window.postMessage({
      type: AuthTokenWindowMessages.CLEAR_AUTH_TOKEN,
    });
  }
}
