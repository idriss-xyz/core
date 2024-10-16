import { Hex } from 'shared/web3';

export const getFollowers = async () => {
  const response = await fetch('https://api.idriss.xyz/get-links');
  const data = (await response.json()) as Record<string, { address: Hex }>;
  return data;
};
