type AlchemyWebhookType = 'ADDRESS_ACTIVITY';

type Token = {
  address: string;
  amount: number;
  decimals: number;
  network: string;
  name?: string | null;
  logoURI?: string | null;
  symbol?: string | null;
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

interface TokenTransfer {
  fromTokenAccount: string;
  fromUserAccount: string;
  mint: string;
  toTokenAccount: string;
  toUserAccount: string;
  tokenAmount: number;
  tokenStandard: string;
}

interface NativeTransfer {
  amount: number;
  fromUserAccount: string;
  toUserAccount: string;
}

interface AccountData {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: {
      mint: string;
      rawTokenAmount: {
        decimals: number;
        tokenAmount: string;
      };
      tokenAccount: string;
      userAccount: string;
    }[];
  }

export interface HeliusWebhookEvent {
  accountData: AccountData[];
  description: string;
  events: { [eventName: string]: Record<string, any> };
  fee: number;
  feePayer: string;
  instructions: any[];
  nativeTransfers: NativeTransfer[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: TokenTransfer[];
  type: string;
  transactionError: string | null;
}
[];

export interface Webhook {
  id: string;
  addresses: Set<string>;
}

export interface StatsResponseInterface {
  uniqueSubscribers: number;
  uniqueAddresses: number;
  dailyNewSubscribers: number;
  weeklyNewSubscribers: number;
  monthlyNewSubscribers: number;
}
