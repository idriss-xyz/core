import { z } from 'zod';
import { EIP1193Provider } from 'mipd';
import { TickSize } from '@polymarket/clob-client';

import { Hex, Wallet } from 'shared/web3';

import { getApiKeyResponseSchema, marketFormSchema } from './schema';
import { OUTCOME } from './constants';

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

export interface MarketData {
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
}

export type GetMarketByConditionIdResponse = MarketData;

export interface GetTokenPriceResponse {
  price: string;
}

export interface BookItem {
  price: string;
  size: string;
}

export interface Book {
  bids: BookItem[];
  asks: BookItem[];
}

export type GetTokenBookResponse = Book;
export type TokenIdToPrice = Record<string, number>;
export type TokenIdToBook = Record<string, Book>;

// TODO: lookup
export type Outcome = (typeof OUTCOME)[keyof typeof OUTCOME];

export interface Token {
  token_id: string;
  outcome: Outcome;
}

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
  switchToPolygon: (provider: EIP1193Provider) => Promise<void>;
}

export interface SafeWallet {
  address: Hex;
  balance: number;
}

export interface OrderDetails {
  minimumTickSize: TickSize;
  negRisk: boolean;
  tokenId: string;
  amount: number;
}

export interface PlaceOrderParameters {
  wallet: Wallet;
  funderAddress: Hex;
  orderDetails: OrderDetails;
}

export interface OrderPlacer {
  reset: () => void;
  place: (parameters: PlaceOrderParameters) => Promise<void>;
  isError: boolean;
  isPlaced: boolean;
  isPlacing: boolean;
}
