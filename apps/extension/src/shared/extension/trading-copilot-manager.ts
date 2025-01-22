import { StoredAuthToken, StoredToastSoundState } from './types';

export const TradingCopilotManager = {
  saveAuthToken(authToken: StoredAuthToken) {
    return chrome.storage.local.set({
      'authentication-token': JSON.stringify(authToken),
    });
  },

  getAuthToken(): Promise<StoredAuthToken> {
    return new Promise((resolve) => {
      void chrome.storage.local
        .get('authentication-token')
        .then((storedAuthTokenRaw) => {
          const storedAuthToken = storedAuthTokenRaw['authentication-token']
            ? (JSON.parse(
                storedAuthTokenRaw['authentication-token'],
              ) as StoredAuthToken)
            : undefined;
          return resolve(storedAuthToken);
        });
    });
  },

  clearAuthToken() {
    return chrome.storage.local.remove('authentication-token');
  },

  saveToastSoundState(ToastSoundState: StoredToastSoundState) {
    return chrome.storage.local.set({
      'toast-toggle-state': JSON.stringify(ToastSoundState),
    });
  },

  getToastSoundState(): Promise<StoredToastSoundState> {
    return new Promise((resolve) => {
      void chrome.storage.local
        .get('toast-toggle-state')
        .then((StoredToastSoundStateRaw) => {
          const StoredToastSoundState = StoredToastSoundStateRaw[
            'toast-toggle-state'
          ]
            ? (JSON.parse(
                StoredToastSoundStateRaw['toast-toggle-state'],
              ) as StoredToastSoundState)
            : undefined;
          return resolve(StoredToastSoundState);
        });
    });
  },

  clearToastSoundState() {
    return chrome.storage.local.remove('toast-toggle-state');
  },
};
