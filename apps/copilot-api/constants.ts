import { SwapData, Webhook } from './types';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const webhooks: Webhook[] = [];
export const MAX_ADDRESSES_PER_WEBHOOK = 10000; // Adjust based on Alchemy's limits - 50000
export const BLOCK_LIST = ['ETH', 'USDC', 'USDT', 'DAI'];

export const WEBHOOK_NETWORKS = ['BASE_MAINNET'];
export enum WEBHOOK_NETWORK_TYPES {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}

export const expiryTime = 5 * 60 * 1000;

export const testSwapData: SwapData = {
  transactionHash:
    '0xcbe526713e8c2095369191287c1fd4c1832716a55abe0b58db7ee91bebe21542',
  from: '0x4a3755eb99ae8b22aafb8f16f0c51cf68eb60b85',
  to: '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae',
  tokenIn: {
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    amount: 357.09,
    decimals: 18,
    network: 'BASE',
  },
  tokenOut: {
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    amount: 0.001,
    decimals: 18,
    network: 'BASE',
  },
  timestamp: '2024-10-28T16:13:17.698Z',
  isComplete: true,
};
