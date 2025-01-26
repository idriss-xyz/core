type ClaimData = {
  amount: string;
  claimIndices: number[];
  expiry: number;
  memo: string;
  signature: string;
};

export type EligibilityCheckResponse = {
  aavegotchi: number;
  across: number;
  allocation: number;
  allocation_extension: number;
  allocation_free: number;
  allocation_gitcoin: number;
  allocation_ido: number;
  allocation_paid: number;
  allocation_partner: number;
  allocation_usage: number;
  allocation_claim: number;
  ardent: number;
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
