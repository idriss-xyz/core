import { type Hex } from "viem";

import { CHAIN } from "../donate/constants";

import { clientEthereum } from "./constants/blockchain-clients";

const SELL_TOKEN_BY_NETWORK: Record<string, string> = {
   [CHAIN.BASE.name.toLowerCase()]: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
   [CHAIN.ETHEREUM.name.toLowerCase()]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
   [CHAIN.POLYGON.name.toLowerCase()]: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
   [CHAIN.ALEPH.shortName.toLowerCase()]: '0x4ca4b85ead5ea49892d3a81dbfae2f5c2f75d53d',
   [CHAIN.MANTLE.name.toLowerCase()]: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
   [CHAIN.OPTIMISM.shortName.toLowerCase()]: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
};

export async function calculateDollar(
   tokenAddress: Hex | undefined,
   amount: bigint | number,
   networkId: number,
   networkName: string,
): Promise<string> {
   const decimals = 18;

   let amountPerDollar = 1;

   try {
      if (SELL_TOKEN_BY_NETWORK[networkId]?.toLowerCase() === tokenAddress?.toLowerCase()) {
         return '1'
      }

      const sellToken = SELL_TOKEN_BY_NETWORK[networkName];
      const buyToken = tokenAddress?.toLowerCase();

      if (!sellToken || !buyToken) {
         throw new Error('Token address or sell token is undefined');
      }

      const response = await fetch(
         `https://api.idriss.xyz/token-price?${new URLSearchParams({
            sellToken,
            buyToken,
            network: networkId.toString(),
            sellAmount: '1000000',
         }).toString()}`
      );

      if (!response.ok) {
         throw new Error(`Failed to fetch token price: ${response.statusText}`);
      }

      const data = await response.json();
      amountPerDollar = data.price;

      const value = Number(amount) / 10 ** decimals / amountPerDollar;

      return Number(value.toFixed(2)).toString();

   } catch (error) {
      console.error('Error in calculateDollar:', error);
      return '0';
   }
}

export const resolveEnsName = async (address: Hex) => {
   let resolved = await clientEthereum.getEnsName({ address });

   if (!resolved) {
      try {
         const response = await fetch(
            `https://api.idriss.xyz/v1/ENS-Addresses?identifier=${address}`,
         );
         const data = await response.json();
         resolved = data.ens;
      } catch (error) {
         console.error('Error resolving ENS:', error);
      }
   }

   return resolved;
};

export const TIP_MESSAGE_EVENT_ABI: Record<string, string> = {
   base: 'event TipMessage(address indexed recipientAddress, string message, address indexed sender, address indexed tokenAddress, uint256 amount, uint256 fee)',
   ethereum:
      'event TipMessage(address recipientAddress, string message, address sender, address tokenAddress)',
   polygon:
      'event TipMessage(address recipientAddress, string message, address sender, address tokenAddress)',
   aleph:
      'event TipMessage(address recipientAddress, string message, address sender, address tokenAddress, uint256 amount, uint256 fee)',
   mantle:
      'event TipMessage(address recipientAddress, string message, address sender, address tokenAddress, uint256 amount, uint256 fee)',
};
