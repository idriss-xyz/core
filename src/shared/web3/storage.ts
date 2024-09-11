import { Hex } from './types';

interface StoredWallet {
  account: Hex;
  providerRdns: string;
}

const STORAGE_KEY = 'idriss-wallet';

export class WalletStorage {
  public static get(): StoredWallet | undefined {
    const storedWalletRaw = localStorage.getItem(STORAGE_KEY);
    const storedWallet = storedWalletRaw
      ? (JSON.parse(storedWalletRaw) as StoredWallet)
      : undefined;
    return storedWallet;
  }

  public static save(payload: StoredWallet) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  public static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
