import { createLookup } from 'shared/utils';

import { ContractConfig, RoundConfig, Scenario, TickSize } from './types';

export const POLYMARKET_WEBSITE = 'https://polymarket.com';
export const POLYMARKET_CLOB_API = 'https://clob.polymarket.com';
export const POLYMARKET_GNOSIS_SAFE_SIGNATURE = 2;

export const POLYMARKET_CONDITIONAL_TOKENS_CONTRACT_ADDRESS =
  '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045';

export const SAFE_USDC_ADDRES = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

export const ERC_20_ABI = [
  'function name() view returns (string)',
  'function allowance(address owner, address spender) view returns (uint)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
] as const;

export const EMPTY_MARKET_FORM = {
  amount: 0,
  selectedTokenId: '',
} as const;

export const EVENT_URL_REGEX = /https:\/\/polymarket\.com\/event\/[^\s"']+/g;

export const ROUNDING_CONFIG: Record<TickSize, RoundConfig> = {
  '0.1': {
    price: 1,
    size: 2,
    amount: 3,
  },
  '0.01': {
    price: 2,
    size: 2,
    amount: 4,
  },
  '0.001': {
    price: 3,
    size: 2,
    amount: 5,
  },
  '0.0001': {
    price: 4,
    size: 2,
    amount: 6,
  },
};

export const SIDE = {
  BUY: 'BUY',
  SELL: 'SELL',
} as const;

export const SIDE_AS_NUMBER = {
  BUY: 0,
} as const;

export const COLLATERAL_TOKEN_DECIMALS = 6;
export const CONDITIONAL_TOKEN_DECIMALS = 6;

export const MATIC_CONTRACTS: ContractConfig = {
  exchange: '0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E',
  negRiskAdapter: '0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296',
  negRiskExchange: '0xC5d563A36AE78145C45a50134d48A1215220f80a',
  collateral: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  conditionalTokens: '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045',
};

export const ORDER_STRUCTURE = [
  { name: 'salt', type: 'uint256' },
  { name: 'maker', type: 'address' },
  { name: 'signer', type: 'address' },
  { name: 'taker', type: 'address' },
  { name: 'tokenId', type: 'uint256' },
  { name: 'makerAmount', type: 'uint256' },
  { name: 'takerAmount', type: 'uint256' },
  { name: 'expiration', type: 'uint256' },
  { name: 'nonce', type: 'uint256' },
  { name: 'feeRateBps', type: 'uint256' },
  { name: 'side', type: 'uint8' },
  { name: 'signatureType', type: 'uint8' },
];

export const PROTOCOL_NAME = 'Polymarket CTF Exchange';
export const PROTOCOL_VERSION = '1';

export const SCENARIO: Record<Scenario, Scenario> = {
  BET_PLACED: 'BET_PLACED',
  WRONG_CHAIN: 'WRONG_CHAIN',
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  BETTING_NOT_AVAILABLE: 'BETTING_NOT_AVAILABLE',
  READY_TO_BET: 'READY_TO_BET',
};

export const EVENT = createLookup(['BET_PLACED']);
