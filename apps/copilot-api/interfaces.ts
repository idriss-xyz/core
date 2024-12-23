import {AlchemyWebhookType} from "./types";

export interface AlchemyRequest extends Request {
    alchemy: {
        rawBody: string;
        signature: string;
    };
}

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

export interface CachedTransaction {
    activities: any[];
    timestamp: number; // Time when the transaction was first added to the cache
}

export interface Webhook {
    id: string;
    addresses: Set<string>;
}
