export type AlchemyWebhookType = 'ADDRESS_ACTIVITY';

export type Token = {
  address: string;
  amount: number;
  decimals: number;
  network: string;
  symbol: string | null;
  name?: string | null;
  logoURI?: string | null;
};

export type SwapData = {
  transactionHash: string;
  from: string | null;
  to: string | null;
  tokenIn: Token | null;
  tokenOut: Token | null;
  timestamp: string;
  isComplete: boolean;
};
