import { Webhook } from './interfaces';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const webhooks: Webhook[] = [];
export const MAX_ADDRESSES_PER_WEBHOOK = 10000; // Adjust based on Alchemy's limits - 50000
export const BLOCK_LIST = ['ETH', 'USDC', 'USDT', 'DAI'];

export const WEBHOOK_NETWORKS = ['BASE_MAINNET'];
export enum WEBHOOK_NETWORK_TYPES {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
}
