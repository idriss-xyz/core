/**
 * Returns the short name of the wallet address
 */
export const getShortWalletHex = (wallet: string) => {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
};

/**
 * Returns if text is wallet address
 */
export const isWalletHex = (text: string) => {
  return text.startsWith('0x');
};
