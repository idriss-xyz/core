import { PublicKey } from '@solana/web3.js';

/**
 * Returns the short name of the wallet address
 */
export const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
};

/**
 * Returns a boolean indicating whether the provided address is a valid Solana address.
 * @param wallet - The wallet address to test
 */
export const isSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true; // If no error is thrown, it's a valid address
  } catch (e) {
    return false; // If an error occurs, it's not a valid address
  }
};
