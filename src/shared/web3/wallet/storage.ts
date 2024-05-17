import { Hex } from '../web3.types';

interface StoredWallet {
  account: Hex;
  providerRdns: string;
}

export class WalletStorage {
  private static key = 'idriss-wallet';

  public static get(): StoredWallet | undefined {
    const storedWalletRaw = localStorage.getItem(this.key);
    const storedWallet = storedWalletRaw
      ? (JSON.parse(storedWalletRaw) as StoredWallet)
      : undefined;
    return storedWallet;
  }

  public static save(payload: StoredWallet) {
    localStorage.setItem(this.key, JSON.stringify(payload));
  }

  public static clear() {
    localStorage.removeItem(this.key);
  }
}
