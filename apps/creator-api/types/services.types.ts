import { Hex } from 'viem';
import { StoredDonationData, LeaderboardStats } from '@idriss-xyz/constants';
import { LAMBDA_FAUCET, LAMBDA_REWARDS } from '../config/aws-config';

export interface TipHistoryResponse {
  donations: StoredDonationData[];
  leaderboard: LeaderboardStats[];
}

export type LambdaName = typeof LAMBDA_FAUCET | typeof LAMBDA_REWARDS;

export type LambdaPayload = {
  recipient: Hex;
  amount: string | bigint;
  chainId: string;
  nonce: number;
};

export type LambdaResponse = {
  Payload?: Uint8Array;
  FunctionError?: string;
};

export type DecodedLambdaBody = Record<string, any>;
