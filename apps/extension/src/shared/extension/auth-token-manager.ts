import { StoredAuthToken } from './types';

export const AuthTokenManager = {
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
};
