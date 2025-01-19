export const formatAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(Math.max(5, address.length - 6))}`;
};
