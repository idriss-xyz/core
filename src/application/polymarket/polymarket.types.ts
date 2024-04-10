import { z } from 'zod';

import { getApiKeyResponseSchema, marketFormSchema } from './polymarket.schema';
import { OUTCOME } from './polymarket.constants';

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

export type MarketForm = z.infer<ReturnType<typeof marketFormSchema>>;
