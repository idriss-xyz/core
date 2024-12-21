export type AlchemyWebhookType = "ADDRESS_ACTIVITY";

export type Token = {
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
