import { Hex } from 'viem';

export type VestingPlan = 'claim_50' | 'claim_and_stake_100';

export type ClaimData = {
  amount: string;
  claimIndices: number[];
  expiry: number;
  memo: string;
  signature: string;
};

export type EligibilityCheckResponse = {
  aavegotchi: number;
  across: number;
  agora: number;
  allocation: number;
  allocation_claim: number;
  allocation_extension: number;
  allocation_free: number;
  allocation_gitcoin: number;
  allocation_ido: number;
  allocation_ido_7d: number;
  allocation_paid: number;
  allocation_partner: number;
  allocation_raw: number;
  allocation_usage: number;
  ardent: number;
  avatar: number;
  claimData: ClaimData;
  extension: number;
  extension_days: number;
  farcaster: number;
  free: number;
  gitcoin: number;
  hacker: number;
  invite_multiplier: number;
  invites: number;
  jumper: number;
  paid: number;
  polymarket: number;
  registration: string;
  snapshot: number;
  tally: number;
  time_multiplier: number;
};

export type VerifyEligibilityPayload = {
  address: string;
  resolvedEnsAddress?: string;
};

export type StoreDataAndNavigatePayload = {
  address: Hex;
};

export type ResolveEnsAddressPayload = {
  name: string;
};

export type ClaimTokensPayload = {
  vestingPlan: VestingPlan;
};

export type TxLoadingHeadingParameters = {
  amount: string;
  vestingPlan: VestingPlan;
};
