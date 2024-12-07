import { z } from 'zod';

import { Hex, Wallet } from 'shared/web3';

import { getApiKeyResponseSchema, marketFormSchema } from './schema';

export interface L1Headers {
  POLY_ADDRESS: string;
  POLY_SIGNATURE: string;
  POLY_TIMESTAMP: string;
  POLY_NONCE: string;
}

export interface L2Headers {
  POLY_ADDRESS: string;
  POLY_SIGNATURE: string;
  POLY_TIMESTAMP: string;
  POLY_API_KEY: string;
  POLY_PASSPHRASE: string;
}

export type GetApiKeyResponse = z.infer<typeof getApiKeyResponseSchema>;

export type MarketData = {
  enable_order_book: boolean;
  active: boolean;
  closed: boolean;
  archived: boolean;
  image: string;
  minimum_order_size: string;
  minimum_tick_size: string;
  condition_id: string;
  question: string;
  tokens: Token[];
  neg_risk: boolean;
  accepting_orders: boolean;
};

export interface GetTokenPriceResponse {
  price: string;
}

export type BookItem = {
  price: string;
  size: string;
};

type Book = {
  bids: BookItem[];
  asks: BookItem[];
};

export type GetTokenBookResponse = Book;
export type TokenIdToPrice = Record<string, number>;
export type TokenIdToBook = Record<string, Book>;

type Outcome = 'Yes' | 'No';

type Token = {
  token_id: string;
  outcome: Outcome;
};

export interface EnhancedToken extends Token {
  price: number;
  book: Book;
}

export type MarketFormValues = z.infer<ReturnType<typeof marketFormSchema>>;

export interface PolymarketUser {
  wallet?: Wallet;
  isSigning: boolean;
  hasUsdcAllowed: boolean;
  isSigningError: boolean;
  hasPolymarketAccount: boolean;
  safeWalletDetails?: SafeWallet;
  signIn: () => Promise<void>;
  switchToPolygon: (wallet: Wallet) => Promise<void>;
}

export interface SafeWallet {
  address: Hex;
  balance: number;
}

export interface PlaceOrderParameters {
  wallet: Wallet;
  funderAddress: Hex;
  orderDetails: {
    minimumTickSize: TickSize;
    negRisk: boolean;
    tokenId: string;
    amount: number;
  };
}

export type SaltedOrderData = OrderData & { salt: string };

export interface OrderPlacer {
  reset: () => void;
  place: (properties: PlaceOrderParameters) => Promise<void>;
  isError: boolean;
  isPlaced: boolean;
  isPlacing: boolean;
}

export type TickSize = '0.1' | '0.01' | '0.001' | '0.0001';

export interface Order {
  order: {
    salt: number;
    maker: string;
    signer: string;
    taker: string;
    tokenId: string;
    makerAmount: string;
    takerAmount: string;
    side: 'BUY';
  };
  owner: string;
  orderType: 'FOK';
}

export interface OrderData {
  maker: string;
  taker: string;
  tokenId: string;
  makerAmount: string;
  takerAmount: string;
  side: 0;
  feeRateBps: string;
  nonce: string;
  signer: string;
  expiration?: string;
  signatureType?: 2;
}

export interface RoundConfig {
  readonly price: number;
  readonly size: number;
  readonly amount: number;
}

export interface ContractConfig {
  exchange: Hex;
  negRiskAdapter: string;
  negRiskExchange: Hex;
  collateral: string;
  conditionalTokens: string;
}

export type Scenario =
  | 'BET_PLACED'
  | 'WRONG_CHAIN'
  | 'WALLET_NOT_CONNECTED'
  | 'BETTING_NOT_AVAILABLE'
  | 'READY_TO_BET';
