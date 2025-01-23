import {
  StoredAuthToken,
  StoredSubscriptionsAmount,
  StoredToastSoundState,
} from './types';

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

  saveSubscriptionsAmount(payload: StoredSubscriptionsAmount) {
    return chrome.storage.local.set({
      'subscriptions-amount': JSON.stringify(payload),
    });
  },

  getSubscriptionsAmount(): Promise<StoredSubscriptionsAmount> {
    return new Promise((resolve) => {
      void chrome.storage.local
        .get('subscriptions-amount')
        .then((StoredSubscriptionsAmountRaw) => {
          const StoredSubscriptionsAmount = StoredSubscriptionsAmountRaw[
            'subscriptions-amount'
          ]
            ? (JSON.parse(
                StoredSubscriptionsAmountRaw['subscriptions-amount'],
              ) as StoredSubscriptionsAmount)
            : undefined;
          return resolve(StoredSubscriptionsAmount);
        });
    });
  },

  clearSubscriptionsAmount() {
    return chrome.storage.local.remove('subscriptions-amount');
  },

  onSubscriptionsAmountChange(
    callback: (newSubscriptionsAmount: StoredSubscriptionsAmount) => void,
  ) {
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes['subscriptions-amount']) {
        const newSubscriptionsAmount = changes['subscriptions-amount'].newValue
          ? (JSON.parse(
              changes['subscriptions-amount'].newValue,
            ) as StoredSubscriptionsAmount)
          : undefined;
        callback(newSubscriptionsAmount);
      }
    });
  },
};
