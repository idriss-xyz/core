/**
 * Returns the short name of the wallet address
 */
export const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
};
