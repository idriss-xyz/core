type AlchemyWebhookType = 'ADDRESS_ACTIVITY';

type Token = {
  address: string;
  symbol: string;
  amount: number;
  decimals: number;
  network: string;
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

export interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: AlchemyWebhookType;
  event: {
    network: string;
    activity: any[];
  };
}

export interface Webhook {
  id: string;
  addresses: Set<string>;
}
